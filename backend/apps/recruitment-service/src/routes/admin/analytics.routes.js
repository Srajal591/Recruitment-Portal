const express = require("express");
const router = express.Router();
const analyticsController = require("../../controllers/admin/analytics.controller");
const authenticate = require("../../shared/middlewares/authenticate");
const { authorize, checkPermission } = require("../../shared/middlewares/authorize");

router.use(authenticate, authorize("admin", "employee"));

router.get(
  "/overview",
  checkPermission("analytics", "view"),
  analyticsController.getOverview,
);
router.get(
  "/funnel",
  checkPermission("analytics", "view"),
  analyticsController.getFunnel,
);
router.get(
  "/top-jobs",
  checkPermission("analytics", "view"),
  analyticsController.getTopJobs,
);
router.get(
  "/payments",
  checkPermission("analytics", "view"),
  analyticsController.getPaymentAnalytics,
);
router.get(
  "/departments",
  checkPermission("analytics", "view"),
  analyticsController.getDepartmentStats,
);
router.get(
  "/demographics",
  checkPermission("analytics", "view"),
  analyticsController.getDemographics,
);

module.exports = router;

