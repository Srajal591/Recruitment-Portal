const http = require("http");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { createProxyMiddleware } = require("http-proxy-middleware");
require("dotenv").config({
  path: require("path").join(__dirname, "../../.env"),
});

const app = express();
const PORT = parseInt(process.env.API_GATEWAY_PORT) || 5000;
const ID_PORT = parseInt(process.env.IDENTITY_SERVICE_PORT) || 5001;
const RC_PORT = parseInt(process.env.RECRUITMENT_SERVICE_PORT) || 5002;
const CM_PORT = parseInt(process.env.COMMUNICATION_SERVICE_PORT) || 5003;
const parsedOrigins =
  process.env.CLIENT_URL?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean) || ["http://localhost:5173"];
const requestTimeoutMs = 15000;

// ── Middleware ────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(
  cors({
    origin: parsedOrigins.length > 1 ? parsedOrigins : parsedOrigins[0],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// ── Health check ──────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "API Gateway is running",
    timestamp: new Date().toISOString(),
    services: {
      identity: `http://localhost:${ID_PORT}`,
      recruitment: `http://localhost:${RC_PORT}`,
      communication: `http://localhost:${CM_PORT}`,
    },
  });
});

// ── Proxy helper ──────────────────────────────────────────────
const proxy = (target, label) =>
  createProxyMiddleware({
    target,
    changeOrigin: true,
    xfwd: true,
    proxyTimeout: 15000,
    timeout: 15000,
    on: {
      error: (err, _req, res) => {
        console.error(`❌ [${label}] ${err.message}`);
        if (!res.headersSent) {
          res
            .status(503)
            .json({ success: false, message: `${label} unavailable` });
        }
      },
    },
  });

const serviceUrl = (port, path) => `http://localhost:${port}${path}`;

const callJson = async (url, authorization) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: authorization ? { Authorization: authorization } : {},
      signal: controller.signal,
    });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(payload?.message || `Request failed with ${response.status}`);
    }

    return payload;
  } finally {
    clearTimeout(timeout);
  }
};

app.get("/api/dashboard/admin", async (req, res) => {
  try {
    const authorization = req.headers.authorization || "";
    const [overview, funnel, topJobs, support, notifications] =
      await Promise.all([
        callJson(serviceUrl(RC_PORT, "/api/admin/analytics/overview"), authorization),
        callJson(serviceUrl(RC_PORT, "/api/admin/analytics/funnel"), authorization),
        callJson(
          serviceUrl(RC_PORT, "/api/admin/analytics/top-jobs?limit=5"),
          authorization,
        ),
        callJson(serviceUrl(CM_PORT, "/api/admin/support/stats"), authorization),
        callJson(
          serviceUrl(ID_PORT, "/api/admin/notifications?limit=20&isRead=false"),
          authorization,
        ),
      ]);

    res.json({
      success: true,
      message: "Dashboard data fetched successfully",
      data: {
        overview: overview?.data ?? null,
        funnel: funnel?.data ?? null,
        topJobs: topJobs?.data?.topJobs || [],
        support: support?.data ?? null,
        notifications: notifications?.data ?? null,
      },
    });
  } catch (error) {
    console.error("❌ [Dashboard Admin]", error.message);
    res.status(503).json({
      success: false,
      message: "Unable to fetch admin dashboard data",
    });
  }
});

app.get("/api/dashboard/candidate", async (req, res) => {
  try {
    const authorization = req.headers.authorization || "";
    const [applications, notifications, tickets, jobs] = await Promise.all([
      callJson(
        serviceUrl(RC_PORT, "/api/candidate/applications?limit=5"),
        authorization,
      ),
      callJson(
        serviceUrl(CM_PORT, "/api/candidate/notifications?limit=5"),
        authorization,
      ),
      callJson(
        serviceUrl(CM_PORT, "/api/candidate/support/tickets?limit=5"),
        authorization,
      ),
      callJson(serviceUrl(RC_PORT, "/api/jobs?limit=5"), authorization),
    ]);

    res.json({
      success: true,
      message: "Dashboard data fetched successfully",
      data: {
        applications: applications?.data ?? [],
        notifications: notifications?.data ?? null,
        tickets: tickets?.data ?? [],
        jobs: jobs?.data?.jobs || [],
        meta: applications?.meta || null,
      },
    });
  } catch (error) {
    console.error("❌ [Dashboard Candidate]", error.message);
    res.status(503).json({
      success: false,
      message: "Unable to fetch candidate dashboard data",
    });
  }
});

// ── Identity Service routes ───────────────────────────────────
app.use("/api/auth", proxy(`http://localhost:${ID_PORT}`, "Identity"));
app.use(
  "/api/admin/employees",
  proxy(`http://localhost:${ID_PORT}`, "Identity"),
);
app.use("/api/admin/roles", proxy(`http://localhost:${ID_PORT}`, "Identity"));
app.use(
  "/api/admin/activity-logs",
  proxy(`http://localhost:${ID_PORT}`, "Identity"),
);

// ── Recruitment Service routes ────────────────────────────────
app.use("/api/jobs", proxy(`http://localhost:${RC_PORT}`, "Recruitment"));
app.use(
  "/api/admin/projects",
  proxy(`http://localhost:${RC_PORT}`, "Recruitment"),
);
app.use("/api/admin/jobs", proxy(`http://localhost:${RC_PORT}`, "Recruitment"));
app.use(
  "/api/admin/applications",
  proxy(`http://localhost:${RC_PORT}`, "Recruitment"),
);
app.use(
  "/api/admin/analytics",
  proxy(`http://localhost:${RC_PORT}`, "Recruitment"),
);
app.use(
  "/api/candidate/applications",
  proxy(`http://localhost:${RC_PORT}`, "Recruitment"),
);

// ── Communication & Payment Service routes ────────────────────
app.use(
  "/api/admin/payments",
  proxy(`http://localhost:${CM_PORT}`, "Communication"),
);
app.use(
  "/api/admin/payment-gateways",
  proxy(`http://localhost:${CM_PORT}`, "Communication"),
);
app.use(
  "/api/admin/support",
  proxy(`http://localhost:${CM_PORT}`, "Communication"),
);
app.use(
  "/api/candidate/notifications",
  proxy(`http://localhost:${CM_PORT}`, "Communication"),
);
app.use(
  "/api/candidate/support",
  proxy(`http://localhost:${CM_PORT}`, "Communication"),
);
app.use(
  "/api/candidate/payments",
  proxy(`http://localhost:${CM_PORT}`, "Communication"),
);

// ── Swagger redirect ──────────────────────────────────────────
app.get("/api/docs", (_req, res) => {
  res.redirect(`http://localhost:${RC_PORT}/api/docs`);
});

// ── 404 ───────────────────────────────────────────────────────
app.use((req, res) => {
  res
    .status(404)
    .json({
      success: false,
      message: `Route not found: ${req.method} ${req.path}`,
    });
});

// ── Error handler ─────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error("❌ Gateway Error:", err.message);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// ── Start ─────────────────────────────────────────────────────
const server = http.createServer(app);

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} is already in use. Run: npm run kill-ports`);
  } else {
    console.error("❌ Server error:", err.message);
  }
  process.exit(1);
});

server.listen(PORT, () => {
  console.log(`🌐 API Gateway running on port ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log(`   Docs:   http://localhost:${PORT}/api/docs`);
});

const shutdown = (signal) => {
  console.log(`⚠️ ${signal} received. Shutting down API Gateway.`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10000).unref();
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

module.exports = app;
