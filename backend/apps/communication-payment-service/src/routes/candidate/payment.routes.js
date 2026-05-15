const express = require("express");
const router = express.Router();
const paymentController = require("../../controllers/candidate/payment.controller");
const authenticate = require("../../../../../packages/common/middlewares/authenticate");
const { authorize } = require("../../../../../packages/common/middlewares/authorize");
const validate = require("../../../../../packages/common/middlewares/validate");
const {
  initiatePaymentSchema,
  verifyPaymentSchema,
} = require("../../../../../packages/common/validations/payment.validation");

router.use(authenticate, authorize("candidate"));

router.post(
  "/initiate",
  validate(initiatePaymentSchema),
  paymentController.initiatePayment,
);
router.post(
  "/verify",
  validate(verifyPaymentSchema),
  paymentController.verifyPayment,
);
router.get("/history", paymentController.getHistory);
router.get("/:transactionId", paymentController.getByTransaction);

module.exports = router;

