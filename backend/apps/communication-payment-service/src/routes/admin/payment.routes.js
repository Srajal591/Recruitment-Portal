const express = require("express");
const router = express.Router();
const paymentController = require("../../controllers/admin/payment.controller");
const authenticate = require("../../shared/middlewares/authenticate");
const { authorize, checkPermission } = require("../../shared/middlewares/authorize");
const { auditLog } = require("../../shared/middlewares/auditLog");
const validate = require("../../shared/middlewares/validate");
const { upsertGatewaySchema } = require("../../shared/validations/payment.validation");

router.use(authenticate, authorize("admin", "employee"));

// Payments
router.get("/payments", checkPermission("paymentSettings", "view"), paymentController.getPayments);
router.get("/payments/stats", checkPermission("paymentSettings", "view"), paymentController.getPaymentStats);

// Gateways
router.get("/payment-gateways", checkPermission("paymentSettings", "view"), paymentController.getGateways);
router.get("/payment-gateways/:name", checkPermission("paymentSettings", "view"), paymentController.getGateway);
router.put(
  "/payment-gateways/:name",
  checkPermission("paymentSettings", "edit"),
  validate(upsertGatewaySchema),
  auditLog("Payments", "UPDATE"),
  paymentController.upsertGateway,
);
router.post(
  "/payment-gateways/:name/test",
  checkPermission("paymentSettings", "view"),
  paymentController.testGateway,
);
router.post(
  "/payment-gateways/:name/set-default",
  checkPermission("paymentSettings", "edit"),
  auditLog("Payments", "UPDATE"),
  paymentController.setDefaultGateway,
);

module.exports = router;
