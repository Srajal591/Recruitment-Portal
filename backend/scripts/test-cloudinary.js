/**
 * Test Cloudinary Configuration
 * Run: node scripts/test-cloudinary.js
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const cloudinary = require("cloudinary").v2;

async function testCloudinary() {
  console.log("\n🧪 Testing Cloudinary Configuration...\n");

  try {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    console.log("📋 Configuration:");
    console.log(`   Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
    console.log(`   API Key: ${process.env.CLOUDINARY_API_KEY}`);
    console.log(
      `   API Secret: ${process.env.CLOUDINARY_API_SECRET ? "***" + process.env.CLOUDINARY_API_SECRET.slice(-4) : "Not set"}`,
    );
    console.log();

    // Test 1: Ping Cloudinary API
    console.log("🔍 Test 1: Checking API connectivity...");
    const pingResult = await cloudinary.api.ping();
    console.log("✅ API Ping successful:", pingResult.status);
    console.log();

    // Test 2: Get account usage
    console.log("🔍 Test 2: Fetching account details...");
    const usage = await cloudinary.api.usage();
    console.log("✅ Account Details:");
    console.log(`   Plan: ${usage.plan}`);
    console.log(
      `   Credits Used: ${usage.credits.usage} / ${usage.credits.limit}`,
    );
    console.log(
      `   Storage: ${(usage.storage.usage / 1024 / 1024).toFixed(2)} MB`,
    );
    console.log(
      `   Bandwidth: ${(usage.bandwidth.usage / 1024 / 1024).toFixed(2)} MB`,
    );
    console.log();

    // Test 3: List folders
    console.log("🔍 Test 3: Listing folders...");
    const folders = await cloudinary.api.root_folders();
    console.log(
      "✅ Root Folders:",
      folders.folders.map((f) => f.name).join(", ") || "None",
    );
    console.log();

    console.log("🎉 All tests passed! Cloudinary is configured correctly.\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Test failed:", error.message);

    if (error.error && error.error.message) {
      console.error("   Error details:", error.error.message);
    }

    if (error.http_code === 401) {
      console.error("\n💡 Tip: Check your API credentials in .env file");
    }

    console.log();
    process.exit(1);
  }
}

testCloudinary();
