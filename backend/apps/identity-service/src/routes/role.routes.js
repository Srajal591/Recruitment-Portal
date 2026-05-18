const express = require("express");
const router = express.Router();
const roleController = require("../controllers/role.controller");
const authenticate = require("../shared/middlewares/authenticate");
const { authorize } = require("../shared/middlewares/authorize");
const { auditLog } = require("../shared/middlewares/auditLog");
const validate = require("../shared/middlewares/validate");
const {
  createRoleSchema,
  updateRoleSchema,
} = require("../shared/validations/role.validation");

router.use(authenticate, authorize("admin", "employee"));

router.get("/", roleController.getRoles);
router.get("/permissions/structure", roleController.getPermissionsStructure);
router.get("/:id", roleController.getRole);
router.post(
  "/",
  validate(createRoleSchema),
  auditLog("Roles", "CREATE"),
  roleController.createRole,
);
router.put(
  "/:id",
  validate(updateRoleSchema),
  auditLog("Roles", "UPDATE"),
  roleController.updateRole,
);
router.delete("/:id", auditLog("Roles", "DELETE"), roleController.deleteRole);

module.exports = router;


