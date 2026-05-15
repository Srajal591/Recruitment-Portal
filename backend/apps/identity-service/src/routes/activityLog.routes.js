const express = require("express");
const router = express.Router();
const activityLogController = require("../controllers/activityLog.controller");
const authenticate = require("../../../../packages/common/middlewares/authenticate");
const { authorize } = require("../../../../packages/common/middlewares/authorize");

router.use(authenticate, authorize("admin", "employee"));

router.get("/", activityLogController.getActivityLogs);
router.get("/export", activityLogController.exportActivityLogs);
router.get(
  "/employee/:employeeId",
  activityLogController.getEmployeeActivityLogs,
);

module.exports = router;


