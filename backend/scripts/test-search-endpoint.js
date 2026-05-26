/**
 * Test Script for /api/jobs/search Endpoint
 * Tests the eligibility filter API with various scenarios
 */

const axios = require("axios");

const API_BASE_URL = process.env.API_GATEWAY_URL || "http://localhost:5000";

const testSearchEndpoint = async () => {
  console.log(`Testing /api/jobs/search endpoint at ${API_BASE_URL}\n`);

  const testCases = [
    {
      name: "Test 1: No filters (all active jobs)",
      params: {},
    },
    {
      name: "Test 2: Graduation + Age 28 + General",
      params: {
        qualification: "Graduation",
        age: 28,
        candidateCategory: "general",
      },
    },
    {
      name: "Test 3: 12th + Age 22 + OBC",
      params: {
        qualification: "12th",
        age: 22,
        candidateCategory: "obc",
      },
    },
    {
      name: "Test 4: Age 40 + SC (with relaxation)",
      params: {
        age: 40,
        candidateCategory: "sc",
      },
    },
    {
      name: 'Test 5: Search "Engineer" + Graduation',
      params: {
        q: "Engineer",
        qualification: "Graduation",
      },
    },
    {
      name: "Test 6: Department filter + Age",
      params: {
        department: "IT",
        age: 30,
      },
    },
    {
      name: "Test 7: Pagination (page 2, limit 5)",
      params: {
        page: 2,
        limit: 5,
      },
    },
    {
      name: "Test 8: PWD Category (max age relaxation)",
      params: {
        age: 50,
        candidateCategory: "pwd",
      },
    },
  ];

  for (const testCase of testCases) {
    try {
      console.log(`\n${testCase.name}`);
      console.log("─".repeat(50));

      const response = await axios.get(`${API_BASE_URL}/api/jobs/search`, {
        params: testCase.params,
        timeout: 5000,
      });

      const { data } = response;

      if (data.success) {
        const jobs = data.data.jobs || [];
        const pagination = data.data.pagination || {};

        console.log(`✓ Status: ${response.status}`);
        console.log(`✓ Jobs found: ${jobs.length}`);
        console.log(`✓ Total items: ${pagination.totalItems}`);
        console.log(`✓ Total pages: ${pagination.totalPages}`);

        if (jobs.length > 0) {
          const firstJob = jobs[0];
          console.log(`\n  First job:`);
          console.log(`    Title: ${firstJob.title}`);
          console.log(`    Post Code: ${firstJob.postCode}`);
          console.log(`    Department: ${firstJob.department}`);
          console.log(`    Applicable Fee: ₹${firstJob.applicableFee}`);
          console.log(`    Days Left: ${firstJob.daysLeft}`);
          console.log(
            `    Age Limit: ${firstJob.ageLimit?.min}-${firstJob.ageLimit?.max}`,
          );
        }
      } else {
        console.log(`✗ Error: ${data.message}`);
      }
    } catch (error) {
      if (error.code === "ECONNREFUSED") {
        console.log(
          `✗ Connection refused. Is the API Gateway running on ${API_BASE_URL}?`,
        );
        break;
      } else if (error.response) {
        console.log(
          `✗ Error ${error.response.status}: ${error.response.data?.message || error.message}`,
        );
      } else {
        console.log(`✗ Error: ${error.message}`);
      }
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log("Test Summary");
  console.log("=".repeat(50));
  console.log("✓ All endpoint tests completed");
  console.log("\nTo run these tests:");
  console.log("1. Start the API Gateway: npm run dev (in backend/)");
  console.log(
    "2. Run this script: node backend/scripts/test-search-endpoint.js",
  );
};

testSearchEndpoint();
