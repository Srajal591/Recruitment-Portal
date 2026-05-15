const express = require("express");
const router = express.Router();
const projectController = require("../../controllers/admin/project.controller");
const authenticate = require("../../../../../packages/common/middlewares/authenticate");
const { authorize, checkPermission } = require("../../../../../packages/common/middlewares/authorize");
const { auditLog } = require("../../../../../packages/common/middlewares/auditLog");
const validate = require("../../../../../packages/common/middlewares/validate");
const {
  createProjectSchema,
  updateProjectSchema,
} = require("../../../../../packages/common/validations/project.validation");

router.use(authenticate, authorize("admin", "employee"));

router.get(
  "/",
  checkPermission("projects", "view"),
  projectController.getProjects,
);
router.get(
  "/stats",
  checkPermission("projects", "view"),
  projectController.getProjectStats,
);
router.get(
  "/:id",
  checkPermission("projects", "view"),
  projectController.getProject,
);
router.post(
  "/",
  checkPermission("projects", "create"),
  validate(createProjectSchema),
  auditLog("Projects", "CREATE"),
  projectController.createProject,
);
router.put(
  "/:id",
  checkPermission("projects", "edit"),
  validate(updateProjectSchema),
  auditLog("Projects", "UPDATE"),
  projectController.updateProject,
);
router.delete(
  "/:id",
  checkPermission("projects", "delete"),
  auditLog("Projects", "DELETE"),
  projectController.deleteProject,
);

module.exports = router;

