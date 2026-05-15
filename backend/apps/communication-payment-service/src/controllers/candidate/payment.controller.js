const { StatusCodes } = require("http-status-codes");
const paymentService = require("../../shared/services/payment.service");
const { ApiResponse } = require("../../shared/utils/ApiResponse");
const asyncHandler = require("../../shared/utils/asyncHandler");

/**
 * @swagger
 * /api/candidate/payments/initiate:
 *   post:
 *     tags: [Candidate - Payments]
 *     summary: Initiate payment for an application
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [applicationId]
 *             properties:
 *               applicationId:
 *                 type: string
 *               gateway:
 *                 type: string
 *                 enum: [razorpay, payu, ccavenue, billdesk]
 *                 default: razorpay
 *     responses:
 *       200: { description: Payment initiated, order details returned }
 *       400: { description: Payment already completed or no fee applicable }
 */
const initiatePayment = asyncHandler(async (req, res) => {
  const { applicationId, gateway = "razorpay" } = req.body;
  const result = await paymentService.initiatePayment(
    applicationId,
    req.user.id,
    gateway,
  );
  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, "Payment initiated", result));
});

/**
 * @swagger
 * /api/candidate/payments/verify:
 *   post:
 *     tags: [Candidate - Payments]
 *     summary: Verify payment after gateway callback
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [transactionId, status]
 *             properties:
 *               transactionId:
 *                 type: string
 *               gatewayPaymentId:
 *                 type: string
 *               gatewaySignature:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [success, failed]
 *     responses:
 *       200: { description: Payment verified }
 *       404: { description: Transaction not found }
 */
const verifyPayment = asyncHandler(async (req, res) => {
  const payment = await paymentService.verifyPayment(req.body);
  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, "Payment verified", { payment }));
});

/**
 * @swagger
 * /api/candidate/payments/history:
 *   get:
 *     tags: [Candidate - Payments]
 *     summary: Get my payment history
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200: { description: Payment history }
 */
const getHistory = asyncHandler(async (req, res) => {
  const result = await paymentService.getPaymentHistory(req.user.id, req.query);
  res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        "Payment history fetched",
        result.payments,
        result.meta,
      ),
    );
});

/**
 * @swagger
 * /api/candidate/payments/{transactionId}:
 *   get:
 *     tags: [Candidate - Payments]
 *     summary: Get payment by transaction ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200: { description: Payment details }
 *       404: { description: Transaction not found }
 */
const getByTransaction = asyncHandler(async (req, res) => {
  const payment = await paymentService.getPaymentByTransaction(
    req.params.transactionId,
    req.user.id,
  );
  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, "Payment fetched", { payment }));
});

module.exports = {
  initiatePayment,
  verifyPayment,
  getHistory,
  getByTransaction,
};


