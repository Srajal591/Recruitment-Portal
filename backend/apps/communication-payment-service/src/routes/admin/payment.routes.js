const express = require("express");
const router = express.Router();
const paymentController = require("../../controllers/admin/payment.controller");
const authenticate = require("../../../../../packages/common/middlewares/authenticate");
const { authorize, checkPermission } = require("../../../../../packages/common/middlewares/authorize");
const { auditLog } = require("../../../../../packages/common/middlewares/auditLog");

router.use(authenticate, authorize("admin", "employee"));

router.get(
  "/payments",
  checkPermission("paymentSettings", "view"),
  paymentController.getPayments,
);
router.get(
  "/payments/stats",
  checkPermission("paymentSettings", "view"),
  paymentController.getPaymentStats,
);
router.get(
  "/payment-gateways",
  checkPermission("paymentSettings", "view"),
  paymentController.getGateways,
);
router.put(
  "/payment-gateways/:name",
  checkPermission("paymentSettings", "edit"),
  auditLog("Payments", "UPDATE"),
  paymentController.upsertGateway,
);

module.exports = router;

