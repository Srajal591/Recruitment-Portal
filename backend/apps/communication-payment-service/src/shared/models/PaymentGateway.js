const mongoose = require("mongoose");

const paymentGatewaySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: ["Razorpay", "Cashfree", "Paytm", "PhonePe"],
      required: true,
      unique: true,
    },
    displayName: { type: String },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "LIMITED"],
      default: "INACTIVE",
    },
    mode: {
      type: String,
      enum: ["Live", "Test"],
      default: "Test",
    },
    isDefault: { type: Boolean, default: false },
    // Stored encrypted — use helpers.encrypt / helpers.decrypt
    apiKey: { type: String, select: false },
    secretKey: { type: String, select: false },
    webhookSecret: { type: String, select: false },
    merchantId: { type: String, select: false }, // Paytm / PhonePe
    settlementDays: { type: String, default: "T+2 Days" },
    supportedMethods: {
      type: [String],
      default: ["card", "upi", "netbanking", "wallet"],
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("PaymentGateway", paymentGatewaySchema);
