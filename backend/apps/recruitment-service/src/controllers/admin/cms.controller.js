const { StatusCodes } = require("http-status-codes");
const StateBanner = require("../../shared/models/StateBanner");
const { ApiResponse } = require("../../shared/utils/ApiResponse");
const asyncHandler = require("../../shared/utils/asyncHandler");
const ApiError = require("../../shared/utils/ApiError");
const { uploadToCloudinary } = require("../../shared/services/upload.service");

// GET /api/admin/cms  — list all state pages with summary
const getAll = asyncHandler(async (req, res) => {
  const pages = await StateBanner.find()
    .populate("featuredJobs", "title postCode department")
    .sort({ updatedAt: -1 })
    .lean();

  const total      = pages.length;
  const published  = pages.filter((p) => p.status === "published").length;
  const draft      = pages.filter((p) => p.status === "draft").length;
  const archived   = pages.filter((p) => p.status === "archived").length;
  const lastUpdated = pages[0]?.updatedAt || null;

  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, "CMS pages fetched", {
      pages,
      stats: { total, published, draft, archived, lastUpdated },
    }),
  );
});

// GET /api/admin/cms/:state  — get one state page by state name
const getOne = asyncHandler(async (req, res) => {
  const page = await StateBanner.findOne({ state: req.params.state })
    .populate("featuredJobs", "title postCode department status")
    .lean();

  if (!page) throw new ApiError(404, "State page not found");

  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, "State page fetched", { page }),
  );
});

// POST /api/admin/cms  — create state page
const create = asyncHandler(async (req, res) => {
  const {
    state, heroTitle, heroSubtitle, bannerImage,
    featuredJobs, announcements, quickLinks, status,
  } = req.body;

  if (!state) throw new ApiError(400, "State is required");

  const existing = await StateBanner.findOne({ state: state.trim() });
  if (existing) throw new ApiError(409, `A page for "${state}" already exists`);

  const page = await StateBanner.create({
    state: state.trim(),
    heroTitle:    heroTitle    || "",
    heroSubtitle: heroSubtitle || "",
    bannerImage:  bannerImage  || "",
    featuredJobs: featuredJobs || [],
    announcements: announcements || [],
    quickLinks:   quickLinks   || {},
    status:       status       || "draft",
    createdBy:    req.user?.id,
    updatedBy:    req.user?.id,
  });

  res.status(StatusCodes.CREATED).json(
    new ApiResponse(StatusCodes.CREATED, "State page created", { page }),
  );
});

// PUT /api/admin/cms/:state  — update state page
const update = asyncHandler(async (req, res) => {
  const page = await StateBanner.findOne({ state: req.params.state });
  if (!page) throw new ApiError(404, "State page not found");

  const allowed = [
    "heroTitle","heroSubtitle","bannerImage",
    "featuredJobs","announcements","quickLinks","status",
  ];
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) page[field] = req.body[field];
  });
  page.updatedBy = req.user?.id;

  await page.save();

  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, "State page updated", { page }),
  );
});

// DELETE /api/admin/cms/:state  — delete state page
const remove = asyncHandler(async (req, res) => {
  const page = await StateBanner.findOneAndDelete({ state: req.params.state });
  if (!page) throw new ApiError(404, "State page not found");

  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, "State page deleted"),
  );
});

// PUT /api/admin/cms/:state/publish  — publish
const publish = asyncHandler(async (req, res) => {
  const page = await StateBanner.findOne({ state: req.params.state });
  if (!page) throw new ApiError(404, "State page not found");
  page.status = "published";
  page.updatedBy = req.user?.id;
  await page.save();
  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, "State page published", { page }),
  );
});

// ── Public endpoint — used by Home page ──────────────────────────────────────
// GET /api/cms/state/:state  — get published page for a state (public, no auth)
const getPublicStatePage = asyncHandler(async (req, res) => {
  const page = await StateBanner.findOne({
    state: req.params.state,
    status: "published",
  })
    .populate("featuredJobs", "title postCode department totalPosts applicationDeadline salaryRange applicationFee workLocation status")
    .lean();

  if (!page) {
    return res.status(StatusCodes.OK).json(
      new ApiResponse(StatusCodes.OK, "No published page for this state", { page: null }),
    );
  }

  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, "State page fetched", { page }),
  );
});

// POST /api/admin/cms/upload-image  — upload banner image to Cloudinary
const uploadBannerImage = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "No image file provided");

  const result = await uploadToCloudinary(req.file.buffer, {
    folder: "recruitment_portal/cms_banners",
    resource_type: "image",
    transformation: [{ width: 1920, height: 480, crop: "fill", quality: "auto" }],
  });

  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, "Image uploaded", {
      url: result.secure_url,
      publicId: result.public_id,
    }),
  );
});

module.exports = { getAll, getOne, create, update, remove, publish, getPublicStatePage, uploadBannerImage };
