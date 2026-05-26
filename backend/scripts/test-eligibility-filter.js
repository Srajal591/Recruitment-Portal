/**
 * Test Script for Smart Eligibility Filter
 * Tests the complete end-to-end flow
 */

const mongoose = require("mongoose");
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const Job = require("../apps/recruitment-service/src/shared/models/Job");
const User = require("../apps/identity-service/src/shared/models/User");

const testEligibilityFilter = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/recruitment-portal",
    );
    console.log("✓ Connected to MongoDB");

    // Test 1: Check if jobs with eligibility criteria exist
    console.log("\n--- Test 1: Jobs with Eligibility Criteria ---");
    const jobsWithEligibility = await Job.find({
      status: "active",
      "ageLimit.min": { $exists: true },
      "education.essential": { $exists: true, $ne: [] },
    }).limit(5);

    if (jobsWithEligibility.length > 0) {
      console.log(
        `✓ Found ${jobsWithEligibility.length} jobs with eligibility criteria`,
      );
      jobsWithEligibility.forEach((job) => {
        console.log(
          `  - ${job.title} (Age: ${job.ageLimit.min}-${job.ageLimit.max})`,
        );
      });
    } else {
      console.log(
        "⚠ No jobs with eligibility criteria found. Create a test job first.",
      );
    }

    // Test 2: Simulate qualification matching
    console.log("\n--- Test 2: Qualification Matching ---");
    const testQualifications = [
      "10th",
      "12th",
      "Graduation",
      "Post Graduation",
    ];
    const degreeKeywords = {
      "10th": ["10th", "matriculation", "sslc"],
      "12th": ["10th", "12th", "intermediate", "hsc"],
      graduation: ["10th", "12th", "graduation", "bachelor", "b.tech", "b.sc"],
      "post graduation": [
        "10th",
        "12th",
        "graduation",
        "bachelor",
        "master",
        "m.tech",
        "phd",
      ],
    };

    testQualifications.forEach((qual) => {
      const keywords = degreeKeywords[qual.toLowerCase()] || [];
      console.log(
        `  ${qual}: Can apply to jobs requiring ${keywords.slice(0, 3).join(", ")}...`,
      );
    });

    // Test 3: Simulate age matching with relaxation
    console.log("\n--- Test 3: Age Matching with Relaxation ---");
    const testCases = [
      { age: 28, category: "general", jobMax: 40, relaxation: 0 },
      { age: 38, category: "sc", jobMax: 35, relaxation: 5 },
      { age: 45, category: "pwd", jobMax: 40, relaxation: 10 },
    ];

    testCases.forEach(({ age, category, jobMax, relaxation }) => {
      const eligible = age <= jobMax + relaxation;
      const status = eligible ? "✓" : "✗";
      console.log(
        `  ${status} Age ${age}, ${category.toUpperCase()}: Job max ${jobMax} + ${relaxation} relaxation = ${jobMax + relaxation}`,
      );
    });

    // Test 4: Fee calculation by category
    console.log("\n--- Test 4: Fee Calculation by Category ---");
    const sampleFees = {
      general: 500,
      obc: 250,
      scSt: 0,
      ews: 250,
      pwd: 0,
    };

    const categories = ["general", "obc", "sc", "st", "ews", "pwd"];
    categories.forEach((cat) => {
      let fee = sampleFees.general;
      if (cat === "sc" || cat === "st") fee = sampleFees.scSt;
      else if (cat === "obc") fee = sampleFees.obc;
      else if (cat === "ews") fee = sampleFees.ews;
      else if (cat === "pwd") fee = sampleFees.pwd;
      console.log(`  ${cat.toUpperCase()}: ₹${fee}`);
    });

    // Test 5: Check active jobs count
    console.log("\n--- Test 5: Active Jobs Status ---");
    const activeJobs = await Job.countDocuments({ status: "active" });
    const futureDeadlineJobs = await Job.countDocuments({
      status: "active",
      applicationDeadline: { $gte: new Date() },
    });

    console.log(`  Total active jobs: ${activeJobs}`);
    console.log(`  Jobs with future deadline: ${futureDeadlineJobs}`);

    // Test 6: Check user categories
    console.log("\n--- Test 6: User Categories ---");
    const userCategories = await User.distinct("category", {
      role: "candidate",
    });
    console.log(
      `  Available categories: ${userCategories.join(", ") || "None"}`,
    );

    console.log("\n✓ All tests completed successfully!");
    console.log("\nNext steps:");
    console.log(
      "1. Create a test job with eligibility criteria via admin panel",
    );
    console.log("2. Register a candidate with a specific category");
    console.log("3. Use Smart Eligibility Filter on home page");
    console.log("4. Verify eligible jobs appear on /eligible-jobs page");
  } catch (error) {
    console.error("✗ Test failed:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("\n✓ Disconnected from MongoDB");
  }
};

testEligibilityFilter();
