const { StatusCodes } = require("http-status-codes");
const paymentService = require("../../shared/services/payment.service");
const { ApiResponse } = require("../../shared/utils/ApiResponse");
const asyncHandler = require("../../shared/utils/asyncHandler");
const { saveAuditLog } = require("../../shared/middlewares/auditLog");

// GET /api/admin/payments
const getPayments = asyncHandler(async (req, res) => {
  const result = await paymentService.getAdminPayments(req.query);
  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, "Payments fetched", result.payments, result.meta),
  );
});

// GET /api/admin/payments/stats
const getPaymentStats = asyncHandler(async (req, res) => {
  const Payment = require("../../shared/models/Payment");
  const [statusStats, gatewayStats, dailyRevenue, totalRevenue] = await Promise.all([
    Payment.aggregate([{ $group: { _id: "$status", count: { $sum: 1 }, total: { $sum: "$amount" } } }]),
    Payment.aggregate([
      { $match: { status: "success" } },
      { $group: { _id: "$gateway", count: { $sum: 1 }, total: { $sum: "$amount" } } },
    ]),
    Payment.aggregate([
      { $match: { status: "success", paidAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$paidAt" } }, count: { $sum: 1 }, amount: { $sum: "$amount" } } },
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

// GET /api/admin/payment-gateways
const getGateways = asyncHandler(async (req, res) => {
  const gateways = await paymentService.getGateways();
  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, "Gateways fetched", { gateways }),
  );
});

// GET /api/admin/payment-gateways/:name
const getGateway = asyncHandler(async (req, res) => {
  const gw = await paymentService.getGatewayByName(req.params.name);
  if (!gw) {
    return res.status(StatusCodes.NOT_FOUND).json(
      new ApiResponse(StatusCodes.NOT_FOUND, "Gateway not found", null),
    );
  }
  // Return config without sensitive keys (mask them)
  const safe = {
    _id: gw._id,
    name: gw.name,
    displayName: gw.displayName,
    status: gw.status,
    mode: gw.mode,
    isDefault: gw.isDefault,
    settlementDays: gw.settlementDays,
    supportedMethods: gw.supportedMethods,
    updatedAt: gw.updatedAt,
    hasApiKey: !!gw.apiKey,
    hasSecretKey: !!gw.secretKey,
    hasWebhookSecret: !!gw.webhookSecret,
    hasMerchantId: !!gw.merchantId,
  };
  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, "Gateway fetched", { gateway: safe }),
  );
});

// PUT /api/admin/payment-gateways/:name
const upsertGateway = asyncHandler(async (req, res) => {
  const gateway = await paymentService.upsertGateway(
    req.params.name,
    req.body,
    req.user.id,
  );
  await saveAuditLog(req, `Updated payment gateway: ${req.params.name}`);
  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, "Gateway configuration updated", { gateway }),
  );
});

// POST /api/admin/payment-gateways/:name/test
const testGateway = asyncHandler(async (req, res) => {
  const result = await paymentService.testGatewayConnection(req.params.name);
  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, "Connection test complete", result),
  );
});

// POST /api/admin/payment-gateways/:name/set-default
const setDefaultGateway = asyncHandler(async (req, res) => {
  const gateway = await paymentService.upsertGateway(
    req.params.name,
    { isDefault: true },
    req.user.id,
  );
  await saveAuditLog(req, `Set default payment gateway: ${req.params.name}`);
  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, "Default gateway updated", { gateway }),
  );
});

module.exports = {
  getPayments,
  getPaymentStats,
  getGateways,
  getGateway,
  upsertGateway,
  testGateway,
  setDefaultGateway,
};
