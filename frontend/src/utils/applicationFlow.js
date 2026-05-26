export const APP_DRAFT_KEY = "app_draft";

const normaliseJob = (jobOrApplication) => {
  const job = jobOrApplication?.jobId || jobOrApplication?.job || jobOrApplication;
  return job?.job || job;
};

export const getJobFormSections = (jobOrApplication) => {
  const job = normaliseJob(jobOrApplication);
  return Array.isArray(job?.formSections)
    ? job.formSections.filter((section) => Array.isArray(section.fields) && section.fields.length > 0)
    : [];
};

export const getJobDocumentRequirements = (jobOrApplication) => {
  const job = normaliseJob(jobOrApplication);
  return Array.isArray(job?.documentRequirements)
    ? job.documentRequirements.filter((doc) => doc?.name)
    : [];
};

export const hasPaymentStep = (jobOrApplication, application) => {
  const job = normaliseJob(jobOrApplication);
  const fee = application?.totalFee || job?.applicationFee?.general || job?.paymentConfig?.applicationFee || 0;
  return Number(fee) >= 0;
};

export const buildApplicationSteps = (jobOrApplication, application = {}) => {
  const formSections = getJobFormSections(jobOrApplication);
  const documentRequirements = getJobDocumentRequirements(jobOrApplication);
  const steps = formSections.map((section, index) => ({
    id: index + 1,
    type: "form",
    name: section.title || `Form Section ${index + 1}`,
    path: `/application/form-responses?section=${index}`,
    sectionIndex: index,
  }));

  if (documentRequirements.length > 0) {
    steps.push({
      id: steps.length + 1,
      type: "documents",
      name: "Document Upload",
      path: "/application/documents",
    });
  }

  steps.push({
    id: steps.length + 1,
    type: "review",
    name: "Review",
    path: "/application/review",
  });

  const job = normaliseJob(jobOrApplication);
  const hasMultiplePosts = Array.isArray(job?.posts) && job.posts.length > 0;
  if (hasMultiplePosts) {
    steps.push({
      id: steps.length + 1,
      type: "post-selection",
      name: "Post Selection",
      path: "/application/post-selection",
    });
  }

  if (hasPaymentStep(jobOrApplication, application)) {
    steps.push({
      id: steps.length + 1,
      type: "payment",
      name: "Payment",
      path: "/application/payment",
    });
  }

  steps.push({
    id: steps.length + 1,
    type: "success",
    name: "Submit",
    path: "/application/success",
  });

  return steps;
};

export const getFirstApplicationRoute = (jobOrApplication) => {
  const steps = buildApplicationSteps(jobOrApplication, jobOrApplication);
  return steps[0]?.path || "/candidate/applications";
};

export const getRouteForApplicationStep = (jobOrApplication, currentStep = 1) => {
  const app = jobOrApplication?.jobId ? jobOrApplication : null;
  const job = app?.jobId || jobOrApplication;
  const steps = buildApplicationSteps(job, app || jobOrApplication);

  if (app) {
    const responses = app.formResponses || {};
    const missingSection = getJobFormSections(job).findIndex((section) =>
      (section.fields || []).some((field) => {
        const value = responses[String(field._id || field.id)];
        return (
          field.required &&
          (value === undefined ||
            value === null ||
            value === "" ||
            (typeof value === "string" && !value.trim()))
        );
      }),
    );
    if (missingSection >= 0) return `/application/form-responses?section=${missingSection}`;

    const requiredDocs = getJobDocumentRequirements(job).filter((doc) => doc.required !== false);
    const uploadedDocs = new Set(
      (app.documents || [])
        .filter((doc) => ["uploaded", "verified"].includes(doc.status))
        .map((doc) => doc.type),
    );
    const missingDocs = requiredDocs.some((doc) => {
      const type = String(doc.name || "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");
      return !uploadedDocs.has(type);
    });
    if (missingDocs) {
      return steps.find((step) => step.type === "documents")?.path || getFirstApplicationRoute(job);
    }

    return steps.find((step) => step.type === "review")?.path || getFirstApplicationRoute(job);
  }

  return steps[Math.max(0, Math.min((currentStep || 1) - 1, steps.length - 1))]?.path || getFirstApplicationRoute(job);
};

export const persistApplicationDraft = ({ applicationId, jobId, declaration }) => {
  let draft = {};
  try {
    draft = JSON.parse(sessionStorage.getItem(APP_DRAFT_KEY) || "{}");
  } catch {
    draft = {};
  }
  sessionStorage.setItem(
    APP_DRAFT_KEY,
    JSON.stringify({
      ...draft,
      applicationId: applicationId || draft.applicationId,
      jobId: jobId || draft.jobId,
      declaration: declaration || draft.declaration,
    }),
  );
};

export const readApplicationDraft = () => {
  try {
    return JSON.parse(sessionStorage.getItem(APP_DRAFT_KEY) || "{}");
  } catch {
    return {};
  }
};
