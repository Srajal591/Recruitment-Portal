const { StatusCodes } = require("http-status-codes");
const Application = require("../../shared/models/Application");
const Job = require("../../shared/models/Job");
const User = require("../../shared/models/User");
const ApiError = require("../../shared/utils/ApiError");
const {
  ApiResponse,
  paginationMeta,
} = require("../../shared/utils/ApiResponse");
const asyncHandler = require("../../shared/utils/asyncHandler");
const {
  emitToAdmins,
  emitToCandidate,
  SOCKET_EVENTS,
} = require("../../shared/socket/index");
const {
  generateApplicationId,
  calculateFee,
  getPaginationParams,
} = require("../../shared/utils/helpers");
const {
  uploadToCloudinary,
  validateFileSize,
  deleteFromCloudinary,
} = require("../../shared/services/upload.service");
const { notify } = require("../../shared/utils/notify");
const { notifyAdmins } = require("../../shared/utils/notifyAdmins");

// ── Helpers ───────────────────────────────────────────────────

const emitStepSaved = (candidateId, applicationId, currentStep, extra = {}) => {
  try {
    emitToCandidate(candidateId, SOCKET_EVENTS.APPLICATION_STATUS_CHANGED, {
      type: "step_saved",
      application: { _id: applicationId, currentStep, ...extra },
      timestamp: new Date(),
    });
  } catch (_) {}
};

const slugify = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const assertApplicationCompleteForJob = (app) => {
  const job = app.jobId;
  const responses =
    app.formResponses instanceof Map
      ? Object.fromEntries(app.formResponses)
      : app.formResponses || {};

  (job.formSections || []).forEach((section) => {
    (section.fields || []).forEach((field) => {
      if (field.type === "file") return;
      const value = responses[String(field._id)];
      const empty =
        value === undefined ||
        value === null ||
        value === "" ||
        (typeof value === "string" && value.trim() === "");
      if (field.required && empty) {
        throw new ApiError(StatusCodes.BAD_REQUEST, `${field.label} is required`);
      }
    });
  });

  const requiredDocs = (job.documentRequirements || [])
    .filter((doc) => doc.required !== false)
    .map((doc) => slugify(doc.name));
  const uploadedDocs = new Set(
    (app.documents || [])
      .filter((doc) => ["uploaded", "verified"].includes(doc.status))
      .map((doc) => doc.type),
  );
  const missingDoc = requiredDocs.find((type) => !uploadedDocs.has(type));
  if (missingDoc) {
    const doc = (job.documentRequirements || []).find(
      (item) => slugify(item.name) === missingDoc,
    );
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `${doc?.name || "Required document"} is required`,
    );
  }
};

// ── Controllers ───────────────────────────────────────────────

/**
 * @swagger
 * /api/candidate/applications:
 *   post:
 *     tags: [Candidate - Applications]
 *     summary: Start a new application for a job
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [jobId]
 *             properties:
 *               jobId:
 *                 type: string
 *     responses:
 *       201: { description: Application created }
 *       409: { description: Already applied }
 */
const createApplication = asyncHandler(async (req, res) => {
  const { jobId } = req.body;
  const candidateId = req.user.id;

  const job = await Job.findById(jobId);
  if (!job) throw new ApiError(StatusCodes.NOT_FOUND, "Job not found");
  if (job.status !== "active")
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Job is not accepting applications",
    );
  if (job.applicationDeadline && new Date() > job.applicationDeadline)
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Application deadline has passed",
    );

  const existing = await Application.findOne({ candidateId, jobId });
  if (existing)
    throw new ApiError(
      StatusCodes.CONFLICT,
      "You have already applied for this job",
    );

  const candidate = await User.findById(candidateId);

  const application = await Application.create({
    applicationId: generateApplicationId(),
    candidateId,
    jobId,
    personalDetails: {
      fullName: candidate.fullName || "",
      registeredMobile: candidate.registeredMobile || "",
      dateOfBirth: candidate.dateOfBirth || null,
      gender: candidate.gender || "",
      category: candidate.category || "",
      fatherName: candidate.fatherName || "",
      motherName: candidate.motherName || "",
      isDomicileOfBihar: candidate.isDomicileOfBihar || false,
    },
    currentStep: 1,
    status: "draft",
  });

  await application.populate(
    "jobId",
    "title department postCode applicationDeadline formSections documentRequirements posts applicationFee paymentConfig",
  );

  try {
    emitToAdmins(SOCKET_EVENTS.APPLICATION_NEW, {
      type: "application_started",
      message: `New application started: ${application.applicationId}`,
      application: {
        _id: application._id,
        applicationId: application.applicationId,
        jobTitle: job.title,
      },
      timestamp: new Date(),
    });
  } catch (_) {}

  res.status(StatusCodes.CREATED).json(
    new ApiResponse(StatusCodes.CREATED, "Application created", {
      application,
    }),
  );
});

/**
 * @swagger
 * /api/candidate/applications:
 *   get:
 *     tags: [Candidate - Applications]
 *     summary: Get my applications
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200: { description: My applications }
 */
const getMyApplications = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationParams(req.query);
  const filter = { candidateId: req.user.id };
  if (req.query.status) filter.status = req.query.status;

  const [applications, total] = await Promise.all([
    Application.find(filter)
      .populate(
        "jobId",
        "title department postCode applicationDeadline examDate formSections documentRequirements posts applicationFee paymentConfig",
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Application.countDocuments(filter),
  ]);

  res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        "Applications fetched",
        applications,
        paginationMeta(total, page, limit),
      ),
    );
});

/**
 * @swagger
 * /api/candidate/applications/{id}:
 *   get:
 *     tags: [Candidate - Applications]
 *     summary: Get a specific application
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200: { description: Application details }
 *       404: { description: Not found }
 */
const getApplication = asyncHandler(async (req, res) => {
  const application = await Application.findOne({
    _id: req.params.id,
    candidateId: req.user.id,
  }).populate("jobId");

  if (!application)
    throw new ApiError(StatusCodes.NOT_FOUND, "Application not found");

  res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(StatusCodes.OK, "Application fetched", { application }),
    );
});

// ── Step update helper ────────────────────────────────────────
const getOwnDraftApplication = async (id, candidateId) => {
  const app = await Application.findOne({ _id: id, candidateId });
  if (!app) throw new ApiError(StatusCodes.NOT_FOUND, "Application not found");
  if (app.status !== "draft")
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Cannot update a submitted application",
    );
  return app;
};

/**
 * @swagger
 * /api/candidate/applications/{id}/personal-details:
 *   put:
 *     tags: [Candidate - Applications]
 *     summary: Save Step 1 — Personal Details
 *     security:
 *       - bearerAuth: []
 */
const updatePersonalDetails = asyncHandler(async (req, res) => {
  const app = await getOwnDraftApplication(req.params.id, req.user.id);
  app.personalDetails = {
    ...(app.personalDetails?.toObject?.() || {}),
    ...req.body,
  };
  app.currentStep = Math.max(app.currentStep, 2);
  app.lastSavedAt = new Date();
  await app.save();
  emitStepSaved(req.user.id, app._id, app.currentStep);
  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, "Personal details saved", {
      _id: app._id,
      currentStep: app.currentStep,
    }),
  );
});

/**
 * @swagger
 * /api/candidate/applications/{id}/education:
 *   put:
 *     tags: [Candidate - Applications]
 *     summary: Save Step 2 — Education
 *     security:
 *       - bearerAuth: []
 */
const updateEducation = asyncHandler(async (req, res) => {
  const app = await getOwnDraftApplication(req.params.id, req.user.id);
  app.education = { ...(app.education?.toObject?.() || {}), ...req.body };
  app.currentStep = Math.max(app.currentStep, 3);
  app.lastSavedAt = new Date();
  await app.save();
  emitStepSaved(req.user.id, app._id, app.currentStep);
  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, "Education details saved", {
      _id: app._id,
      currentStep: app.currentStep,
    }),
  );
});

/**
 * @swagger
 * /api/candidate/applications/{id}/additional-info:
 *   put:
 *     tags: [Candidate - Applications]
 *     summary: Save Step 3 — Additional Info
 *     security:
 *       - bearerAuth: []
 */
const updateAdditionalInfo = asyncHandler(async (req, res) => {
  const app = await getOwnDraftApplication(req.params.id, req.user.id);
  app.additionalInfo = {
    ...(app.additionalInfo?.toObject?.() || {}),
    ...req.body,
  };
  app.currentStep = Math.max(app.currentStep, 4);
  app.lastSavedAt = new Date();
  await app.save();
  emitStepSaved(req.user.id, app._id, app.currentStep);
  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, "Additional info saved", {
      _id: app._id,
      currentStep: app.currentStep,
    }),
  );
});

/**
 * @swagger
 * /api/candidate/applications/{id}/address:
 *   put:
 *     tags: [Candidate - Applications]
 *     summary: Save Step 4 — Address
 *     security:
 *       - bearerAuth: []
 */
const updateAddress = asyncHandler(async (req, res) => {
  const app = await getOwnDraftApplication(req.params.id, req.user.id);
  app.address = { ...(app.address?.toObject?.() || {}), ...req.body };
  app.currentStep = Math.max(app.currentStep, 5);
  app.lastSavedAt = new Date();
  await app.save();
  emitStepSaved(req.user.id, app._id, app.currentStep);
  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, "Address saved", {
      _id: app._id,
      currentStep: app.currentStep,
    }),
  );
});

/**
 * @swagger
 * /api/candidate/applications/{id}/form-responses:
 *   put:
 *     tags: [Candidate - Applications]
 *     summary: Save Dynamic Form Responses (Custom Fields from Job)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               formResponses:
 *                 type: object
 *     responses:
 *       200:
 *         description: Form responses saved
 *       400:
 *         description: Invalid field submission
 *       404:
 *         description: Application or job not found
 */
const updateFormResponses = asyncHandler(async (req, res) => {
  const app = await getOwnDraftApplication(req.params.id, req.user.id);
  
  // Fetch the job to get formSections for validation
  const job = await Job.findById(app.jobId);
  if (!job) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Job not found");
  }

  const { formResponses } = req.body;
  if (!formResponses || typeof formResponses !== "object") {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Invalid formResponses format"
    );
  }

  // Validate that submitted fields exist in job's formSections and satisfy
  // the admin's required/type/option constraints.
  const allowedFieldIds = new Set();
  const fieldMap = new Map();
  (job.formSections || []).forEach((section) => {
    (section.fields || []).forEach((field) => {
      const id = String(field._id);
      allowedFieldIds.add(id);
      fieldMap.set(id, field);
    });
  });

  // Check that all submitted fields are allowed (security check)
  for (const fieldId of Object.keys(formResponses)) {
    if (!allowedFieldIds.has(fieldId)) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        `Field ${fieldId} is not allowed for this job`
      );
    }
  }

  for (const [fieldId, field] of fieldMap.entries()) {
    if (field.type === "file") continue;
    const value = formResponses[fieldId];
    const empty =
      value === undefined ||
      value === null ||
      value === "" ||
      (typeof value === "string" && value.trim() === "");

    if (field.required && empty) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        `${field.label} is required`,
      );
    }

    if (empty) continue;

    if (["select", "radio"].includes(field.type)) {
      const options = field.options || [];
      if (!options.includes(value)) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          `${field.label} has an invalid selected option`,
        );
      }
    }

    if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, `${field.label} must be a valid email`);
    }

    if (field.type === "tel" && !/^[6-9]\d{9}$/.test(String(value).replace(/\D/g, ""))) {
      throw new ApiError(StatusCodes.BAD_REQUEST, `${field.label} must be a valid mobile number`);
    }

    if (field.type === "number") {
      const num = Number(value);
      if (Number.isNaN(num)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, `${field.label} must be a number`);
      }
      if (field.validation?.min !== undefined && num < field.validation.min) {
        throw new ApiError(StatusCodes.BAD_REQUEST, field.validation.message || `${field.label} is below minimum`);
      }
      if (field.validation?.max !== undefined && num > field.validation.max) {
        throw new ApiError(StatusCodes.BAD_REQUEST, field.validation.message || `${field.label} is above maximum`);
      }
    }

    if (field.validation?.pattern) {
      try {
        const regex = new RegExp(field.validation.pattern);
        if (!regex.test(String(value))) {
          throw new ApiError(StatusCodes.BAD_REQUEST, field.validation.message || `${field.label} is invalid`);
        }
      } catch (err) {
        if (err instanceof ApiError) throw err;
      }
    }
  }

  // Update formResponses in application
  app.formResponses = new Map(Object.entries(formResponses));
  app.currentStep = Math.max(app.currentStep, 6);
  app.lastSavedAt = new Date();
  await app.save();

  emitStepSaved(req.user.id, app._id, app.currentStep);

  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, "Form responses saved", {
      _id: app._id,
      currentStep: app.currentStep,
    }),
  );
});

/**
 * @swagger
 * /api/candidate/applications/{id}/documents/{type}:
 *   post:
 *     tags: [Candidate - Applications]
 *     summary: Upload Step 5 — Document
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [passport_photo, signature, tenth_certificate, twelfth_certificate, graduation_certificate, category_certificate, aadhar_card, driving_license, computer_certificate, domicile_certificate]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200: { description: Document uploaded }
 */
const uploadDocument = asyncHandler(async (req, res) => {
  // Allow document uploads on both draft and submitted apps (before payment)
  const app = await Application.findOne({
    _id: req.params.id,
    candidateId: req.user.id,
  });
  if (!app) throw new ApiError(StatusCodes.NOT_FOUND, "Application not found");
  if (app.paymentStatus === "paid") {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Cannot upload documents after payment is completed",
    );
  }
  const docType = req.params.type;
  await app.populate("jobId");

  const requirements = app.jobId?.documentRequirements || [];
  const requirementMap = new Map(
    requirements.map((doc) => [slugify(doc.name), doc]),
  );
  const selectedRequirement = requirementMap.get(docType);
  if (requirements.length > 0 && !selectedRequirement) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "This document is not required for this job",
    );
  }

  if (!req.file)
    throw new ApiError(StatusCodes.BAD_REQUEST, "No file uploaded");

  const maxSizeKB = selectedRequirement?.maxSizeKB;
  if (maxSizeKB && req.file.size > maxSizeKB * 1024) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `File too large. Max size for ${selectedRequirement.name}: ${maxSizeKB}KB`,
    );
  } else {
    validateFileSize(req.file.size, docType);
  }

  // Delete old document from Cloudinary if exists
  const existingDoc = app.documents.find((d) => d.type === docType);
  if (existingDoc?.cloudinaryPublicId) {
    await deleteFromCloudinary(existingDoc.cloudinaryPublicId);
  }

  // Upload to Cloudinary
  const result = await uploadToCloudinary(req.file.buffer, {
    folder: `recruitment_portal/applications/${app._id}/${docType}`,
    public_id: `${docType}_${Date.now()}`,
  });

  // Update or add document entry
  const docData = {
    type: docType,
    name: selectedRequirement?.name || docType.replace(/_/g, " "),
    cloudinaryUrl: result.secure_url,
    cloudinaryPublicId: result.public_id,
    originalName: req.file.originalname,
    sizeKB: Math.round(req.file.size / 1024),
    status: "uploaded",
    uploadedAt: new Date(),
  };

  if (existingDoc) {
    Object.assign(existingDoc, docData);
  } else {
    app.documents.push(docData);
  }

  app.currentStep = Math.max(app.currentStep, 6);
  app.lastSavedAt = new Date();

  // Check if all required docs are uploaded
  const uploadedTypes = app.documents
    .filter((d) => d.status === "uploaded")
    .map((d) => d.type);
  const requiredTypes =
    requirements.length > 0
      ? requirements.filter((doc) => doc.required !== false).map((doc) => slugify(doc.name))
      : [
          "passport_photo",
          "signature",
          "tenth_certificate",
          "twelfth_certificate",
        ];
  const allRequired = requiredTypes.every((t) => uploadedTypes.includes(t));
  if (allRequired) app.documentStatus = "pending";

  await app.save();

  emitStepSaved(req.user.id, app._id, app.currentStep, {
    documentType: docType,
  });

  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, "Document uploaded successfully", {
      document: docData,
      currentStep: app.currentStep,
      documentStatus: app.documentStatus,
    }),
  );
});

/**
 * @swagger
 * /api/candidate/applications/{id}/post-selection:
 *   put:
 *     tags: [Candidate - Applications]
 *     summary: Save Step 7 — Post Selection
 *     security:
 *       - bearerAuth: []
 */
const updatePostSelection = asyncHandler(async (req, res) => {
  const { appliedPosts } = req.body;

  // Allow updating post-selection on both draft and submitted apps
  // (submitted apps may need to update posts before payment is finalized)
  const app = await Application.findOne({
    _id: req.params.id,
    candidateId: req.user.id,
  });
  if (!app) throw new ApiError(StatusCodes.NOT_FOUND, "Application not found");

  // Block only if payment is already done
  if (app.paymentStatus === "paid") {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Cannot update post selection after payment is completed",
    );
  }

  await app.populate("jobId");

  const candidate = await User.findById(req.user.id).select("category");
  const activeJobPosts = (app.jobId.posts || []).filter(
    (post) => post.status !== "inactive",
  );
  const availablePosts =
    activeJobPosts.length > 0
      ? activeJobPosts
      : [
          {
            _id: app.jobId._id,
            postCode: app.jobId.postCode,
            title: app.jobId.title,
            designation: app.jobId.title,
            department: app.jobId.department,
            vacancies: app.jobId.totalPosts,
          },
        ];
  const availablePostMap = new Map(
    availablePosts.map((post) => [post._id.toString(), post]),
  );
  const preferences = new Set();
  const selectedPostIds = new Set();

  const postsWithFee = (appliedPosts || []).map((post) => {
    const key = (post.postId || post.jobId || "").toString();
    const jobPost = availablePostMap.get(key);
    if (!jobPost) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Selected post is not available for this job",
      );
    }

    if (selectedPostIds.has(key)) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "A post can be selected only once",
      );
    }
    selectedPostIds.add(key);

    if (preferences.has(post.preference)) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Post preferences must be unique",
      );
    }
    preferences.add(post.preference);

    return {
      jobId: app.jobId._id,
      postId: jobPost._id,
      postCode: jobPost.postCode || "",
      title: jobPost.title || jobPost.designation,
      designation: jobPost.designation || jobPost.title,
      department: jobPost.department || app.jobId.department || "",
      vacancies: jobPost.vacancies || 0,
      preference: post.preference,
      fee: 0,
    };
  });

  postsWithFee.sort((a, b) => a.preference - b.preference);

  const totalFee = calculateFee(
    app.jobId.applicationFee || {},
    app.personalDetails?.category || candidate?.category,
  );
  postsWithFee.forEach((post, index) => {
    post.preference = index + 1;
    post.fee = index === 0 ? totalFee : 0;
  });

  app.appliedPosts = postsWithFee;
  app.totalFee = totalFee;
  app.currentStep = Math.max(app.currentStep, 8);
  app.lastSavedAt = new Date();
  await app.save();

  emitStepSaved(req.user.id, app._id, app.currentStep, { totalFee });

  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, "Post selection saved", {
      _id: app._id,
      currentStep: app.currentStep,
      appliedPosts: app.appliedPosts,
      totalFee: app.totalFee,
    }),
  );
});

/**
 * @swagger
 * /api/candidate/applications/{id}/submit:
 *   post:
 *     tags: [Candidate - Applications]
 *     summary: Final submission of application
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [declaration]
 *             properties:
 *               declaration:
 *                 type: string
 *     responses:
 *       200: { description: Application submitted }
 *       400: { description: Payment pending or steps incomplete }
 */
const submitApplication = asyncHandler(async (req, res) => {
  const app = await Application.findOne({
    _id: req.params.id,
    candidateId: req.user.id,
  }).populate("jobId");

  if (!app) throw new ApiError(StatusCodes.NOT_FOUND, "Application not found");

  // Allow re-submission if already submitted (idempotent)
  if (app.status === "submitted") {
    return res.status(StatusCodes.OK).json(
      new ApiResponse(StatusCodes.OK, "Application already submitted", {
        _id: app._id,
        applicationId: app.applicationId,
        status: app.status,
        submittedAt: app.submittedAt,
      }),
    );
  }

  if (app.status !== "draft")
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Cannot update a non-draft application",
    );

  // Save declaration and advance step — actual final submit happens via /finalize after payment
  if (req.body.declaration) {
    app.declaration = req.body.declaration;
  }

  // Always keep as draft — finalize handles the actual submission
  app.currentStep = Math.max(app.currentStep, 7);
  app.lastSavedAt = new Date();
  await app.save();

  const candidate = await User.findById(req.user.id).select("fullName email");

  try {
    emitToAdmins(SOCKET_EVENTS.APPLICATION_SUBMITTED, {
      type: "application_submitted",
      message: `Application submitted: ${app.applicationId}`,
      application: {
        _id: app._id,
        applicationId: app.applicationId,
        candidateName: candidate?.fullName,
        jobTitle: app.jobId.title,
      },
      timestamp: new Date(),
    });

    emitToCandidate(req.user.id, SOCKET_EVENTS.APPLICATION_SUBMITTED, {
      type: "submitted",
      message: "Your application has been submitted successfully!",
      application: {
        _id: app._id,
        applicationId: app.applicationId,
        status: app.status,
      },
      timestamp: new Date(),
    });
  } catch (_) {}

  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, "Application submitted successfully", {
      _id: app._id,
      applicationId: app.applicationId,
      status: app.status,
      submittedAt: app.submittedAt,
    }),
  );
});

/**
 * @swagger
 * /api/candidate/applications/{id}/finalize:
 *   post:
 *     tags: [Candidate - Applications]
 *     summary: Finalize application after payment (Step 9)
 *     security:
 *       - bearerAuth: []
 */
const finalizeApplication = asyncHandler(async (req, res) => {
  const app = await Application.findOne({
    _id: req.params.id,
    candidateId: req.user.id,
  }).populate("jobId");

  if (!app) throw new ApiError(StatusCodes.NOT_FOUND, "Application not found");

  // Already fully finalized with payment — idempotent
  if (app.status === "submitted" && app.paymentStatus === "paid") {
    return res.status(StatusCodes.OK).json(
      new ApiResponse(StatusCodes.OK, "Application already submitted", {
        _id: app._id,
        applicationId: app.applicationId,
        status: app.status,
        submittedAt: app.submittedAt,
      }),
    );
  }

  assertApplicationCompleteForJob(app);

  // Mark payment as simulated/paid and finalize
  app.paymentStatus = "paid";
  app.status = "submitted";
  app.submittedAt = new Date();
  app.currentStep = 9;
  if (req.body.transactionId) app.transactionId = req.body.transactionId;
  if (req.body.declaration) app.declaration = req.body.declaration;
  await app.save();

  const candidate = await User.findById(req.user.id).select("fullName email");

  // Notify candidate — payment success
  await notify({
    recipientId: req.user.id,
    type: "payment_success",
    title: "Payment Successful",
    message: `Your payment for application ${app.applicationId} was successful. Application submitted!`,
    link: `/candidate/applications`,
    metadata: {
      applicationId: app.applicationId,
      transactionId: req.body.transactionId || "",
    },
  });

  // Notify candidate — application submitted
  await notify({
    recipientId: req.user.id,
    type: "application_submitted",
    title: "Application Submitted",
    message: `Your application ${app.applicationId} for ${app.jobId?.title || "the job"} has been submitted successfully.`,
    link: `/candidate/applications`,
    metadata: { applicationId: app.applicationId },
  });

  // Notify all admins — new application received
  notifyAdmins({
    type: "application_submitted",
    title: "New Application Received",
    message: `${candidate?.fullName || "A candidate"} submitted application ${app.applicationId} for "${app.jobId?.title || "a job"}".`,
    link: `/admin/applications/${app._id}`,
    metadata: { applicationId: app.applicationId },
  });

  try {
    emitToAdmins(SOCKET_EVENTS.APPLICATION_SUBMITTED, {
      type: "application_submitted",
      message: `Application submitted: ${app.applicationId}`,
      application: {
        _id: app._id,
        applicationId: app.applicationId,
        candidateName: candidate?.fullName,
        jobTitle: app.jobId?.title,
      },
      timestamp: new Date(),
    });

    emitToCandidate(req.user.id, SOCKET_EVENTS.APPLICATION_SUBMITTED, {
      type: "submitted",
      message: "Your application has been submitted successfully!",
      application: {
        _id: app._id,
        applicationId: app.applicationId,
        status: app.status,
      },
      timestamp: new Date(),
    });
  } catch (_) {}

  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, "Application finalized successfully", {
      _id: app._id,
      applicationId: app.applicationId,
      status: app.status,
      submittedAt: app.submittedAt,
    }),
  );
});

module.exports = {
  createApplication,
  getMyApplications,
  getApplication,
  updatePersonalDetails,
  updateEducation,
  updateAdditionalInfo,
  updateAddress,
  updateFormResponses,
  uploadDocument,
  updatePostSelection,
  submitApplication,
  finalizeApplication,
};
