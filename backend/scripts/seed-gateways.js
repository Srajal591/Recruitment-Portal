/**
 * Seed Payment Gateways
 * Run: node scripts/seed-gateways.js
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");

const C = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  bright: "\x1b[1m",
};

const paymentGatewaySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    displayName: { type: String },
    status: { type: String, enum: ["ACTIVE", "INACTIVE", "LIMITED"], default: "INACTIVE" },
    mode: { type: String, enum: ["Live", "Test"], default: "Test" },
    isDefault: { type: Boolean, default: false },
    apiKey: { type: String, select: false },
    secretKey: { type: String, select: false },
    webhookSecret: { type: String, select: false },
    merchantId: { type: String, select: false },
    settlementDays: { type: String, default: "T+2 Days" },
    supportedMethods: { type: [String], default: ["card", "upi", "netbanking", "wallet"] },
  },
  { timestamps: true },
);

const GATEWAYS = [
  {
    name: "Razorpay",
    displayName: "Razorpay",
    status: "INACTIVE",
    mode: "Test",
    isDefault: true,
    settlementDays: "T+2 Days",
    supportedMethods: ["card", "upi", "netbanking", "wallet", "emi"],
  },
  {
    name: "Cashfree",
    displayName: "Cashfree",
    status: "INACTIVE",
    mode: "Test",
    isDefault: false,
    settlementDays: "T+1 Day",
    supportedMethods: ["card", "upi", "netbanking", "wallet"],
  },
  {
    name: "Paytm",
    displayName: "Paytm",
    status: "INACTIVE",
    mode: "Test",
    isDefault: false,
    settlementDays: "T+2 Days",
    supportedMethods: ["paytm_wallet", "upi", "card", "netbanking"],
  },
  {
    name: "PhonePe",
    displayName: "PhonePe",
    status: "INACTIVE",
    mode: "Test",
    isDefault: false,
    settlementDays: "T+1 Day",
    supportedMethods: ["upi", "card", "netbanking"],
  },
];

async function seed() {
  console.log(`\n${C.bright}${C.cyan}💳 Seeding Payment Gateways...${C.reset}\n`);

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`${C.green}✅ Connected to MongoDB${C.reset}\n`);

    const PaymentGateway =
      mongoose.models.PaymentGateway ||
      mongoose.model("PaymentGateway", paymentGatewaySchema);

    for (const gw of GATEWAYS) {
      const existing = await PaymentGateway.findOne({ name: gw.name });
      if (existing) {
        console.log(`${C.yellow}⚠️  Gateway exists: ${gw.name}${C.reset}`);
      } else {
        await PaymentGateway.create(gw);
        console.log(`${C.green}✅ Created gateway: ${gw.name}${C.reset}`);
      }
    }

    console.log(`\n${C.bright}${C.green}╔══════════════════════════════════════════╗
║   ✅ Payment Gateways seeded!            ║
╚══════════════════════════════════════════╝${C.reset}

${C.bright}Gateways created:${C.reset}
  • Razorpay  (Default, INACTIVE)
  • Cashfree  (INACTIVE)
  • Paytm     (INACTIVE)
  • PhonePe   (INACTIVE)

${C.bright}Next steps:${C.reset}
  1. Login to Admin Panel → Payment Settings
  2. Click "Configure" on any gateway
  3. Add your API keys and activate

`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error(`${C.red}❌ Seed failed: ${error.message}${C.reset}`);
    process.exit(1);
  }
}

seed();
