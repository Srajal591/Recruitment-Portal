const express = require("express");
const router = express.Router();
const paymentController = require("../../controllers/candidate/payment.controller");
const authenticate = require("../../shared/middlewares/authenticate");
const { authorize } = require("../../shared/middlewares/authorize");
const validate = require("../../shared/middlewares/validate");
const {
  initiatePaymentSchema,
  verifyPaymentSchema,
} = require("../../shared/validations/payment.validation");

// ── Webhook (no auth — raw body needed for signature verification) ──
router.post(
  "/razorpay/webhook",
  express.raw({ type: "application/json" }),
  paymentController.razorpayWebhook,
);

// ── Authenticated routes ──────────────────────────────────────
router.use(authenticate, authorize("candidate"));

router.post("/initiate", validate(initiatePaymentSchema), paymentController.initiatePayment);
router.post("/verify", validate(verifyPaymentSchema), paymentController.verifyPayment);
router.get("/history", paymentController.getHistory);
router.get("/:transactionId", paymentController.getByTransaction);

module.exports = router;
