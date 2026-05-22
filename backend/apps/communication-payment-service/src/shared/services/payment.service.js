const crypto = require("crypto");
const Payment = require("../models/Payment");
const Application = require("../models/Application");
const PaymentGateway = require("../models/PaymentGateway");
const ApiError = require("../utils/ApiError");
const { generateUUID, getPaginationParams, encrypt, decrypt } = require("../utils/helpers");
const { paginationMeta } = require("../utils/ApiResponse");
const {
  emitToCandidate,
  emitToAdmins,
  SOCKET_EVENTS,
} = require("../socket/index");
const { sendPaymentSuccessEmail } = require("./email.service");

// ── Get active gateway config (with decrypted keys) ──────────
const getActiveGatewayConfig = async (gatewayName) => {
  const gw = await PaymentGateway.findOne({ name: gatewayName })
    .select("+apiKey +secretKey +webhookSecret +merchantId");
  if (!gw) throw new ApiError(404, `Gateway ${gatewayName} not configured`);
  if (gw.status !== "ACTIVE")
    throw new ApiError(400, `Gateway ${gatewayName} is not active`);

  const config = {
    name: gw.name,
    mode: gw.mode,
    apiKey: gw.apiKey ? decrypt(gw.apiKey) : null,
    secretKey: gw.secretKey ? decrypt(gw.secretKey) : null,
    webhookSecret: gw.webhookSecret ? decrypt(gw.webhookSecret) : null,
    merchantId: gw.merchantId ? decrypt(gw.merchantId) : null,
  };
  return config;
};

// ── Get default active gateway ────────────────────────────────
const getDefaultGateway = async () => {
  // Try default first, then any active
  let gw = await PaymentGateway.findOne({ isDefault: true, status: "ACTIVE" });
  if (!gw) gw = await PaymentGateway.findOne({ status: "ACTIVE" });
  // If no active gateway, return null (will use simulation mode)
  return gw ? gw.name.toLowerCase() : null;
};

// ── Create Razorpay order ─────────────────────────────────────
const createRazorpayOrder = async (config, amount, currency, receipt) => {
  const Razorpay = require("razorpay");
  const instance = new Razorpay({
    key_id: config.apiKey,
    key_secret: config.secretKey,
  });
  const order = await instance.orders.create({
    amount: amount * 100, // paise
    currency,
    receipt,
    payment_capture: 1,
  });
  return order;
};

// ── Verify Razorpay signature ─────────────────────────────────
const verifyRazorpaySignature = (orderId, paymentId, signature, secret) => {
  const body = `${orderId}|${paymentId}`;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");
  return expected === signature;
};

// ── Initiate Payment ──────────────────────────────────────────
const initiatePayment = async (applicationId, candidateId, gatewayName) => {
  const application = await Application.findOne({
    _id: applicationId,
    candidateId,
  }).populate("appliedPosts");

  if (!application) throw new ApiError(404, "Application not found");
  if (application.paymentStatus === "paid")
    throw new ApiError(400, "Payment already completed");

  // Calculate total fee from applied posts
  let totalFee = application.totalFee || 0;
  if (!totalFee && application.appliedPosts?.length > 0) {
    totalFee = application.appliedPosts.reduce((sum, p) => sum + (p.fee || 0), 0);
  }
  if (totalFee === 0)
    throw new ApiError(400, "No fee applicable for this application");

  // Determine gateway
  const resolvedGateway = gatewayName || (await getDefaultGateway());
  const normalizedGateway = resolvedGateway ? resolvedGateway.toLowerCase() : "simulation";

  const transactionId = `TXN-${Date.now()}-${generateUUID().slice(0, 8).toUpperCase()}`;

  // Create payment record
  const payment = await Payment.create({
    transactionId,
    applicationId,
    candidateId,
    amount: totalFee,
    gateway: normalizedGateway === "simulation" ? "razorpay" : normalizedGateway,
    status: "initiated",
  });

  let gatewayOrderId = null;
  let gatewayKeyId = null;

  // Try to create real gateway order
  try {
    if (normalizedGateway === "razorpay") {
      const config = await getActiveGatewayConfig("Razorpay").catch(() => null);
      if (config && config.apiKey && config.secretKey) {
        const order = await createRazorpayOrder(
          config,
          totalFee,
          "INR",
          transactionId,
        );
        gatewayOrderId = order.id;
        gatewayKeyId = config.apiKey;

        // Save order ID
        payment.gatewayOrderId = gatewayOrderId;
        await payment.save();
      }
    }
    // Cashfree, Paytm, PhonePe — add SDK calls here when credentials available
  } catch (err) {
    // Gateway call failed — still return transaction for manual/test flow
    console.warn(`[Payment] Gateway order creation failed: ${err.message}`);
  }

  return {
    transactionId,
    paymentId: payment._id,
    amount: totalFee,
    currency: "INR",
    gateway: normalizedGateway,
    gatewayOrderId,
    gatewayKeyId, // Razorpay key_id for frontend SDK
    applicationId: application.applicationId,
  };
};

// ── Verify Payment ────────────────────────────────────────────
const verifyPayment = async ({
  transactionId,
  gatewayOrderId,
  gatewayPaymentId,
  gatewaySignature,
  status,
}) => {
  const payment = await Payment.findOne({ transactionId });
  if (!payment) throw new ApiError(404, "Transaction not found");
  if (payment.status === "success")
    throw new ApiError(400, "Payment already verified");

  let verified = false;

  // Razorpay signature verification
  if (payment.gateway === "razorpay" && gatewayPaymentId && gatewaySignature) {
    try {
      const config = await getActiveGatewayConfig("Razorpay").catch(() => null);
      if (config && config.secretKey) {
        const orderId = gatewayOrderId || payment.gatewayOrderId;
        verified = verifyRazorpaySignature(
          orderId,
          gatewayPaymentId,
          gatewaySignature,
          config.secretKey,
        );
        if (!verified) {
          payment.status = "failed";
          payment.failureReason = "Signature verification failed";
          await payment.save();
          throw new ApiError(400, "Payment signature verification failed");
        }
      } else {
        // No secret key configured — trust status from frontend (dev mode)
        verified = status === "success";
      }
    } catch (err) {
      if (err.statusCode === 400) throw err;
      // Gateway config error — trust status
      verified = status === "success";
    }
  } else {
    // Other gateways or no signature — trust status
    verified = status === "success";
  }

  // Update payment record
  payment.gatewayPaymentId = gatewayPaymentId;
  payment.gatewaySignature = gatewaySignature;
  if (gatewayOrderId) payment.gatewayOrderId = gatewayOrderId;
  payment.status = verified ? "success" : "failed";
  if (verified) payment.paidAt = new Date();
  if (!verified && !payment.failureReason)
    payment.failureReason = "Payment failed at gateway";
  await payment.save();

  // Update application
  const application = await Application.findById(payment.applicationId)
    .populate("candidateId", "email fullName");

  if (application) {
    application.paymentStatus = verified ? "paid" : "failed";
    application.transactionId = transactionId;
    if (verified && application.status === "draft") {
      application.status = "submitted";
      application.submittedAt = new Date();
    }
    await application.save();

    const candidateId = application.candidateId?._id?.toString();

    if (verified && candidateId) {
      emitToCandidate(candidateId, SOCKET_EVENTS.PAYMENT_SUCCESS, {
        transactionId,
        amount: payment.amount,
        applicationId: application.applicationId,
      });
      emitToAdmins(SOCKET_EVENTS.ADMIN_LIVE_COUNT, {
        type: "payment_received",
        amount: payment.amount,
      });
      try {
        await sendPaymentSuccessEmail(
          application.candidateId.email,
          application.candidateId.fullName,
          transactionId,
          payment.amount,
        );
      } catch (_) { /* email failure non-critical */ }
    } else if (!verified && candidateId) {
      emitToCandidate(candidateId, SOCKET_EVENTS.PAYMENT_FAILED, {
        transactionId,
        applicationId: application.applicationId,
      });
    }
  }

  return payment;
};

// ── Razorpay Webhook Handler ──────────────────────────────────
const handleRazorpayWebhook = async (rawBody, signature) => {
  try {
    const config = await getActiveGatewayConfig("Razorpay");
    if (!config.webhookSecret) return { processed: false };

    const expected = crypto
      .createHmac("sha256", config.webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (expected !== signature) {
      throw new ApiError(400, "Invalid webhook signature");
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event;

    if (eventType === "payment.captured" || eventType === "payment.authorized") {
      const paymentEntity = event.payload?.payment?.entity;
      if (paymentEntity) {
        const { order_id, id: paymentId, signature: sig } = paymentEntity;
        // Find payment by gateway order ID
        const payment = await Payment.findOne({ gatewayOrderId: order_id });
        if (payment && payment.status !== "success") {
          await verifyPayment({
            transactionId: payment.transactionId,
            gatewayOrderId: order_id,
            gatewayPaymentId: paymentId,
            gatewaySignature: sig || "",
            status: "success",
          });
        }
      }
    } else if (eventType === "payment.failed") {
      const paymentEntity = event.payload?.payment?.entity;
      if (paymentEntity) {
        const payment = await Payment.findOne({
          gatewayOrderId: paymentEntity.order_id,
        });
        if (payment && payment.status === "initiated") {
          payment.status = "failed";
          payment.failureReason = paymentEntity.error_description || "Payment failed";
          await payment.save();
        }
      }
    }

    return { processed: true, event: eventType };
  } catch (err) {
    console.error("[Webhook] Error:", err.message);
    throw err;
  }
};

// ── Payment History ───────────────────────────────────────────
const getPaymentHistory = async (candidateId, query) => {
  const { page, limit, skip } = getPaginationParams(query);
  const [payments, total] = await Promise.all([
    Payment.find({ candidateId })
      .populate("applicationId", "applicationId jobId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Payment.countDocuments({ candidateId }),
  ]);
  return { payments, meta: paginationMeta(total, page, limit) };
};

const getPaymentByTransaction = async (transactionId, candidateId) => {
  const filter = { transactionId };
  if (candidateId) filter.candidateId = candidateId;
  const payment = await Payment.findOne(filter).populate(
    "applicationId",
    "applicationId",
  );
  if (!payment) throw new ApiError(404, "Transaction not found");
  return payment;
};

// ── Admin: Get all payments ───────────────────────────────────
const getAdminPayments = async (query) => {
  const { page, limit, skip } = getPaginationParams(query);
  const filter = {};
  if (query.status) filter.status = query.status;
  if (query.gateway) filter.gateway = query.gateway;

  const [payments, total] = await Promise.all([
    Payment.find(filter)
      .populate("candidateId", "fullName email")
      .populate("applicationId", "applicationId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Payment.countDocuments(filter),
  ]);
  return { payments, meta: paginationMeta(total, page, limit) };
};

// ── Admin: Gateway config ─────────────────────────────────────
const getGateways = async () =>
  PaymentGateway.find().sort({ isDefault: -1, name: 1 }).select("-apiKey -secretKey -webhookSecret -merchantId");

const getGatewayByName = async (name) => {
  const gw = await PaymentGateway.findOne({ name })
    .select("+apiKey +secretKey +webhookSecret +merchantId");
  return gw;
};

const upsertGateway = async (name, data, updatedBy) => {
  const updateData = { ...data, updatedBy };

  // Encrypt sensitive fields
  if (data.apiKey) updateData.apiKey = encrypt(data.apiKey);
  if (data.secretKey) updateData.secretKey = encrypt(data.secretKey);
  if (data.webhookSecret) updateData.webhookSecret = encrypt(data.webhookSecret);
  if (data.merchantId) updateData.merchantId = encrypt(data.merchantId);

  // If setting as default, unset others
  if (data.isDefault === true) {
    await PaymentGateway.updateMany({ name: { $ne: name } }, { isDefault: false });
  }

  return PaymentGateway.findOneAndUpdate({ name }, updateData, {
    new: true,
    upsert: true,
    runValidators: true,
  }).select("-apiKey -secretKey -webhookSecret -merchantId");
};

// ── Test gateway connectivity ─────────────────────────────────
const testGatewayConnection = async (name) => {
  try {
    const config = await getActiveGatewayConfig(name);
    if (name === "Razorpay" && config.apiKey && config.secretKey) {
      const Razorpay = require("razorpay");
      const instance = new Razorpay({
        key_id: config.apiKey,
        key_secret: config.secretKey,
      });
      // Test by fetching orders (lightweight call)
      await instance.orders.all({ count: 1 });
      return { connected: true, message: "Connection successful" };
    }
    return { connected: false, message: "No credentials configured" };
  } catch (err) {
    return { connected: false, message: err.message };
  }
};

module.exports = {
  initiatePayment,
  verifyPayment,
  handleRazorpayWebhook,
  getPaymentHistory,
  getPaymentByTransaction,
  getAdminPayments,
  getGateways,
  getGatewayByName,
  upsertGateway,
  testGatewayConnection,
  getDefaultGateway,
};
