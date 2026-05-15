const { z } = require("zod");

const initiatePaymentSchema = z.object({
  applicationId: z.string().min(1, "Application ID is required"),
  gateway: z
    .enum(["razorpay", "payu", "ccavenue", "billdesk"])
    .default("razorpay"),
});

const verifyPaymentSchema = z.object({
  transactionId: z.string().min(1, "Transaction ID is required"),
  gatewayPaymentId: z.string().optional(),
  gatewaySignature: z.string().optional(),
  status: z.enum(["success", "failed"]),
});

const upsertGatewaySchema = z.object({
  status: z.enum(["ACTIVE", "INACTIVE", "LIMITED"]).optional(),
  mode: z.enum(["Live", "Test"]).optional(),
  apiKey: z.string().optional(),
  secretKey: z.string().optional(),
  webhookSecret: z.string().optional(),
  settlementDays: z.string().optional(),
});

module.exports = {
  initiatePaymentSchema,
  verifyPaymentSchema,
  upsertGatewaySchema,
};
