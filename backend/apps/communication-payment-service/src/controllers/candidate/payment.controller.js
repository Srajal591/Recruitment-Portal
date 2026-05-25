const { StatusCodes } = require("http-status-codes");
const paymentService = require("../../shared/services/payment.service");
const { ApiResponse } = require("../../shared/utils/ApiResponse");
const asyncHandler = require("../../shared/utils/asyncHandler");

// POST /api/candidate/payments/initiate
const initiatePayment = asyncHandler(async (req, res) => {
  const { applicationId, gateway } = req.body;
  const result = await paymentService.initiatePayment(
    applicationId,
    req.user.id,
    gateway,
  );
  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, "Payment initiated", result),
  );
});

// POST /api/candidate/payments/verify
const verifyPayment = asyncHandler(async (req, res) => {
  const payment = await paymentService.verifyPayment(req.body);
  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, "Payment verified", { payment }),
  );
});

// GET /api/candidate/payments/history
const getHistory = asyncHandler(async (req, res) => {
  const result = await paymentService.getPaymentHistory(req.user.id, req.query);
  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, "Payment history fetched", result.payments, result.meta),
  );
});

// GET /api/candidate/payments/:transactionId
const getByTransaction = asyncHandler(async (req, res) => {
  const payment = await paymentService.getPaymentByTransaction(
    req.params.transactionId,
    req.user.id,
  );
  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, "Payment fetched", { payment }),
  );
});

// POST /api/candidate/payments/razorpay/webhook
const razorpayWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers["x-razorpay-signature"];
  const rawBody = req.body; // raw buffer from express.raw()
  const result = await paymentService.handleRazorpayWebhook(
    rawBody.toString(),
    signature,
  );
  res.status(StatusCodes.OK).json({ received: true, ...result });
});

// POST /api/candidate/payments/cashfree/webhook
const cashfreeWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers["x-webhook-signature"] || req.headers["x-cashfree-signature"];
  const timestamp = req.headers["x-webhook-timestamp"] || "";
  const rawBody   = req.body?.toString() || "";
  const result    = await paymentService.handleCashfreeWebhook(rawBody, signature, timestamp);
  res.status(StatusCodes.OK).json({ received: true, ...result });
});

// POST /api/candidate/payments/paytm/webhook
const paytmWebhook = asyncHandler(async (req, res) => {
  const rawBody = req.body?.toString() || "";
  const result  = await paymentService.handlePaytmWebhook(rawBody);
  res.status(StatusCodes.OK).json({ received: true, ...result });
});

// POST /api/candidate/payments/phonepe/webhook
const phonepeWebhook = asyncHandler(async (req, res) => {
  const xVerify = req.headers["x-verify"] || "";
  const rawBody = req.body?.toString() || "";
  const result  = await paymentService.handlePhonePeWebhook(rawBody, xVerify);
  res.status(StatusCodes.OK).json({ received: true, ...result });
});

module.exports = {
  initiatePayment,
  verifyPayment,
  getHistory,
  getByTransaction,
  razorpayWebhook,
  cashfreeWebhook,
  paytmWebhook,
  phonepeWebhook,
};
