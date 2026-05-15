const http = require("http");
const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const compression = require("compression");
require("dotenv").config({
  path: require("path").join(__dirname, "../../.env"),
});
require("express-async-errors");

// ── Packages (shared) ─────────────────────────────────────────
const connectDB = require("./src/shared/config/database");
const { connectRedis } = require("./src/shared/config/redis");
const { initSocket } = require("./src/shared/socket/index");
const logger = require("./src/shared/utils/logger");
const errorHandler = require("./src/shared/middlewares/errorHandler");
const notFound = require("./src/shared/middlewares/notFound");
const {
  authLimiter,
} = require("./src/shared/middlewares/rateLimiter");

// ── Service-local routes ──────────────────────────────────────
const authRoutes = require("./src/routes/auth.routes");
const employeeRoutes = require("./src/routes/employee.routes");
const roleRoutes = require("./src/routes/role.routes");
const activityLogRoutes = require("./src/routes/activityLog.routes");

const PORT = parseInt(process.env.IDENTITY_SERVICE_PORT) || 5001;

const app = express();

// ── Middleware ────────────────────────────────────────────────
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Routes ────────────────────────────────────────────────────
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/admin/employees", employeeRoutes);
app.use("/api/admin/roles", roleRoutes);
app.use("/api/admin/activity-logs", activityLogRoutes);

// ── Health ────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({
    success: true,
    service: "Identity Service",
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

  const httpServer = http.createServer(app);
  initSocket(httpServer);

  httpServer.on("error", (err) => {
    if (err.code === "EADDRINUSE")
      logger.error(`Port ${PORT} already in use. Run: npm run kill-ports`);
    else logger.error(`Server error: ${err.message}`);
    process.exit(1);
  });

  httpServer.listen(PORT, () => {
    logger.info(`🔐 Identity Service running on port ${PORT}`);
    console.log(`🔐 Identity Service: http://localhost:${PORT}`);
  });
};

startServer().catch((err) => {
  logger.error(`Failed to start Identity Service: ${err.message}`);
  process.exit(1);
});

module.exports = app;
