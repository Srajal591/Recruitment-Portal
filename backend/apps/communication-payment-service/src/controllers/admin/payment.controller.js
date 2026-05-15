const { StatusCodes } = require("http-status-codes");
const paymentService = require("../../shared/services/payment.service");
const { ApiResponse } = require("../../shared/utils/ApiResponse");
const asyncHandler = require("../../shared/utils/asyncHandler");
const { saveAuditLog } = require("../../shared/middlewares/auditLog");

/**
 * @swagger
 * /api/admin/payments:
 *   get:
 *     tags: [Admin - Payments]
 *     summary: Get all payments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [initiated, pending, success, failed, refunded]
 *       - in: query
 *         name: gateway
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200: { description: List of payments }
 */
const getPayments = asyncHandler(async (req, res) => {
  const result = await paymentService.getAdminPayments(req.query);
  res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        "Payments fetched",
        result.payments,
        result.meta,
      ),
    );
});

/**
 * @swagger
 * /api/admin/payment-gateways:
 *   get:
 *     tags: [Admin - Payments]
 *     summary: Get all payment gateway configurations
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: List of gateways }
 */
const getGateways = asyncHandler(async (req, res) => {
  const gateways = await paymentService.getGateways();
  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, "Gateways fetched", { gateways }));
});

/**
 * @swagger
 * /api/admin/payment-gateways/{name}:
 *   put:
 *     tags: [Admin - Payments]
 *     summary: Create or update a payment gateway configuration
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Razorpay, Cashfree, BillDesk, CCAvenue]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE, LIMITED]
 *               mode:
 *                 type: string
 *                 enum: [Live, Test]
 *               apiKey:
 *                 type: string
 *               secretKey:
 *                 type: string
 *               webhookSecret:
 *                 type: string
 *               settlementDays:
 *                 type: string
 *     responses:
 *       200: { description: Gateway updated }
 */
const upsertGateway = asyncHandler(async (req, res) => {
  const gateway = await paymentService.upsertGateway(
    req.params.name,
    req.body,
    req.user.id,
  );
  await saveAuditLog(req, `Updated payment gateway: ${req.params.name}`);
  res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(StatusCodes.OK, "Gateway configuration updated", {
        gateway,
      }),
    );
});

/**
 * @swagger
 * /api/admin/payments/stats:
 *   get:
 *     tags: [Admin - Payments]
 *     summary: Get payment statistics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Payment stats }
 */
const getPaymentStats = asyncHandler(async (req, res) => {
  const Payment = require("../../shared/models/Payment");

  const [statusStats, gatewayStats, dailyRevenue, totalRevenue] =
    await Promise.all([
      Payment.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            total: { $sum: "$amount" },
          },
        },
      ]),
      Payment.aggregate([
        { $match: { status: "success" } },
        {
          $group: {
            _id: "$gateway",
            count: { $sum: 1 },
            total: { $sum: "$amount" },
          },
        },
      ]),
      Payment.aggregate([
        {
          $match: {
            status: "success",
            paidAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$paidAt" } },
            count: { $sum: 1 },
            amount: { $sum: "$amount" },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Payment.aggregate([
        { $match: { status: "success" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, "Payment stats fetched", {
      statusStats,
      gatewayStats,
      dailyRevenue,
      totalRevenue: totalRevenue[0]?.total || 0,
    }),
  );
});

module.exports = { getPayments, getGateways, upsertGateway, getPaymentStats };


