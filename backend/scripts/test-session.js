/**
 * Test script to verify session management
 * Tests: Login -> Store tokens -> Refresh token -> Verify session persists
 */

const axios = require("axios");

const API_BASE = "http://localhost:5000/api";

// Test credentials (use seed admin)
const ADMIN_CREDS = {
  email: "admin@recruitment.gov.in",
  password: "Admin@123456",
};

let accessToken = null;
let refreshToken = null;

const testSessionManagement = async () => {
  console.log("🧪 Testing Session Management\n");

  try {
    // Step 1: Login
    console.log("1️⃣  Testing Admin Login...");
    const loginRes = await axios.post(
      `${API_BASE}/auth/admin/login`,
      ADMIN_CREDS,
    );

    if (
      loginRes.data.success &&
      loginRes.data.data.accessToken &&
      loginRes.data.data.refreshToken
    ) {
      accessToken = loginRes.data.data.accessToken;
      refreshToken = loginRes.data.data.refreshToken;
      console.log("✅ Login successful");
      console.log(`   Access Token: ${accessToken.substring(0, 20)}...`);
      console.log(`   Refresh Token: ${refreshToken.substring(0, 20)}...`);
    } else {
      console.log("❌ Login failed - tokens not returned");
      return;
    }

    // Step 2: Verify access token works
    console.log("\n2️⃣  Testing Access Token...");
    const meRes = await axios.get(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (meRes.data.success && meRes.data.data.user) {
      console.log("✅ Access token valid");
      console.log(
        `   User: ${meRes.data.data.user.fullName || meRes.data.data.user.officialEmail}`,
      );
    } else {
      console.log("❌ Access token validation failed");
      return;
    }

    // Step 3: Test refresh token
    console.log("\n3️⃣  Testing Refresh Token...");
    const refreshRes = await axios.post(`${API_BASE}/auth/refresh-token`, {
      refreshToken: refreshToken,
    });

    if (
      refreshRes.data.success &&
      refreshRes.data.data.accessToken &&
      refreshRes.data.data.refreshToken
    ) {
      const newAccessToken = refreshRes.data.data.accessToken;
      const newRefreshToken = refreshRes.data.data.refreshToken;
      console.log("✅ Token refresh successful");
      console.log(`   New Access Token: ${newAccessToken.substring(0, 20)}...`);
      console.log(
        `   New Refresh Token: ${newRefreshToken.substring(0, 20)}...`,
      );

      accessToken = newAccessToken;
      refreshToken = newRefreshToken;
    } else {
      console.log("❌ Token refresh failed");
      return;
    }

    // Step 4: Verify new access token works
    console.log("\n4️⃣  Testing New Access Token...");
    const meRes2 = await axios.get(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (meRes2.data.success && meRes2.data.data.user) {
      console.log("✅ New access token valid");
      console.log(
        `   User: ${meRes2.data.data.user.fullName || meRes2.data.data.user.officialEmail}`,
      );
    } else {
      console.log("❌ New access token validation failed");
      return;
    }

    // Step 5: Test logout
    console.log("\n5️⃣  Testing Logout...");
    const logoutRes = await axios.post(
      `${API_BASE}/auth/logout`,
      {},
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    if (logoutRes.data.success) {
      console.log("✅ Logout successful");
    } else {
      console.log("❌ Logout failed");
      return;
    }

    // Step 6: Verify token is invalidated
    console.log("\n6️⃣  Verifying Token Invalidation...");
    try {
      await axios.get(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log("❌ Token should be invalidated but still works");
    } catch (error) {
      if (error.response?.status === 401) {
        console.log("✅ Token properly invalidated after logout");
      } else {
        console.log("⚠️  Unexpected error:", error.message);
      }
    }

    console.log("\n✅ All session management tests passed!\n");
  } catch (error) {
    console.error("\n❌ Test failed:", error.response?.data || error.message);
    process.exit(1);
  }
};

// Run tests
testSessionManagement();
