const express = require("express");
const router = express.Router();
const applicationController = require("../../controllers/candidate/application.controller");
const authenticate = require("../../../../../packages/common/middlewares/authenticate");
const { authorize } = require("../../../../../packages/common/middlewares/authorize");
const { upload } = require("../../../../../src/services/upload.service");
const validate = require("../../../../../packages/common/middlewares/validate");
const {
  createApplicationSchema,
  personalDetailsSchema,
  educationSchema,
  additionalInfoSchema,
  addressSchema,
  postSelectionSchema,
  submitApplicationSchema,
} = require("../../../../../packages/common/validations/application.validation");

router.use(authenticate, authorize("candidate"));

router.get("/", applicationController.getMyApplications);
router.post(
  "/",
  validate(createApplicationSchema),
  applicationController.createApplication,
);
router.get("/:id", applicationController.getApplication);
router.put(
  "/:id/personal-details",
  validate(personalDetailsSchema),
  applicationController.updatePersonalDetails,
);
router.put(
  "/:id/education",
  validate(educationSchema),
  applicationController.updateEducation,
);
router.put(
  "/:id/additional-info",
  validate(additionalInfoSchema),
  applicationController.updateAdditionalInfo,
);
router.put(
  "/:id/address",
  validate(addressSchema),
  applicationController.updateAddress,
);
router.post(
  "/:id/documents/:type",
  upload.single("file"),
  applicationController.uploadDocument,
);
router.put(
  "/:id/post-selection",
  validate(postSelectionSchema),
  applicationController.updatePostSelection,
);
router.post(
  "/:id/submit",
  validate(submitApplicationSchema),
  applicationController.submitApplication,
);

module.exports = router;


