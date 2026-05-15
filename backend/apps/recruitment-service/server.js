const http = require("http");
const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const compression = require("compression");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config({
  path: require("path").join(__dirname, "../../.env"),
});
require("express-async-errors");

// ── Packages (shared) ─────────────────────────────────────────
const connectDB = require("./src/shared/config/database");
const { connectRedis } = require("./src/shared/config/redis");
const { connectCloudinary } = require("./src/shared/config/cloudinary");
const { initSocket } = require("./src/shared/socket/index");
const logger = require("./src/shared/utils/logger");
const errorHandler = require("./src/shared/middlewares/errorHandler");
const notFound = require("./src/shared/middlewares/notFound");
const { apiLimiter } = require("./src/shared/middlewares/rateLimiter");

// ── Swagger (uses shared docs) ────────────────────────────────
const swaggerSpec = require("./src/docs/swagger");

// ── Service-local routes ──────────────────────────────────────
const publicJobRoutes = require("./src/routes/public/job.routes");
const adminProjectRoutes = require("./src/routes/admin/project.routes");
const adminJobRoutes = require("./src/routes/admin/job.routes");
const adminApplicationRoutes = require("./src/routes/admin/application.routes");
const adminAnalyticsRoutes = require("./src/routes/admin/analytics.routes");
const candidateApplicationRoutes = require("./src/routes/candidate/application.routes");

const PORT = parseInt(process.env.RECRUITMENT_SERVICE_PORT) || 5002;

const app = express();

// ── Middleware ────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Swagger ───────────────────────────────────────────────────
app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "Recruitment Portal API",
    customCss: ".swagger-ui .topbar { background-color: #ea580c; }",
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
    },
  }),
);
app.get("/api/docs.json", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// ── Routes ────────────────────────────────────────────────────
app.use("/api", apiLimiter);
app.use("/api/jobs", publicJobRoutes);
app.use("/api/admin/projects", adminProjectRoutes);
app.use("/api/admin/jobs", adminJobRoutes);
app.use("/api/admin/applications", adminApplicationRoutes);
app.use("/api/admin/analytics", adminAnalyticsRoutes);
app.use("/api/candidate/applications", candidateApplicationRoutes);

// ── Health ────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({
    success: true,
    service: "Recruitment Service",
    port: PORT,
    timestamp: new Date().toISOString(),
  });
});

// ── Error handling ────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────────
const startServer = async () => {
  await connectDB();
  connectRedis();
  connectCloudinary();

  // Initialize email service
  const { sendEmail } = require("./src/shared/services/email.service");

  const httpServer = http.createServer(app);
  initSocket(httpServer);

  httpServer.on("error", (err) => {
    if (err.code === "EADDRINUSE")
      logger.error(`Port ${PORT} already in use. Run: npm run kill-ports`);
    else logger.error(`Server error: ${err.message}`);
    process.exit(1);
  });

  httpServer.listen(PORT, () => {
    logger.info(`📋 Recruitment Service running on port ${PORT}`);
    console.log(`📋 Recruitment Service: http://localhost:${PORT}`);
    console.log(`   Swagger: http://localhost:${PORT}/api/docs`);
  });
};

startServer().catch((err) => {
  logger.error(`Failed to start Recruitment Service: ${err.message}`);
  process.exit(1);
});

module.exports = app;
