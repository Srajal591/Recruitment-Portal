const mongoose = require("mongoose");

const paymentGatewaySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: ["Razorpay", "Cashfree", "BillDesk", "CCAvenue"],
      required: true,
      unique: true,
    },
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
    // Stored encrypted — use helpers.encrypt / helpers.decrypt
    apiKey: { type: String, select: false },
    secretKey: { type: String, select: false },
    webhookSecret: { type: String, select: false },
    settlementDays: { type: String, default: "1-2 Days" },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("PaymentGateway", paymentGatewaySchema);
