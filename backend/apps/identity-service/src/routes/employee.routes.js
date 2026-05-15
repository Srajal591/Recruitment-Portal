const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employee.controller");
const authenticate = require("../../../../packages/common/middlewares/authenticate");
const { authorize } = require("../../../../packages/common/middlewares/authorize");
const { auditLog } = require("../../../../packages/common/middlewares/auditLog");
const validate = require("../../../../packages/common/middlewares/validate");
const {
  createEmployeeSchema,
  updateEmployeeSchema,
} = require("../../../../packages/common/validations/employee.validation");

router.use(authenticate, authorize("admin"));

router.get("/", employeeController.getEmployees);
router.get("/stats", employeeController.getEmployeeStats);
router.get("/:id", employeeController.getEmployee);
router.post(
  "/",
  validate(createEmployeeSchema),
  auditLog("Employees", "CREATE"),
  employeeController.createEmployee,
);
router.put(
  "/:id",
  validate(updateEmployeeSchema),
  auditLog("Employees", "UPDATE"),
  employeeController.updateEmployee,
);
router.delete(
  "/:id",
  auditLog("Employees", "DELETE"),
  employeeController.deleteEmployee,
);

module.exports = router;


