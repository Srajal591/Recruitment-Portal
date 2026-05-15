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
const { connectRabbitMQ } = require("./src/shared/config/rabbitmq");
const { initSocket } = require("./src/shared/socket/index");
const logger = require("./src/shared/utils/logger");
const errorHandler = require("./src/shared/middlewares/errorHandler");
const notFound = require("./src/shared/middlewares/notFound");
const { apiLimiter } = require("./src/shared/middlewares/rateLimiter");

// ── Service-local routes ──────────────────────────────────────
const adminPaymentRoutes = require("./src/routes/admin/payment.routes");
const adminSupportRoutes = require("./src/routes/admin/support.routes");
const candidateNotificationRoutes = require("./src/routes/candidate/notification.routes");
const candidateSupportRoutes = require("./src/routes/candidate/support.routes");
const candidatePaymentRoutes = require("./src/routes/candidate/payment.routes");

const PORT = parseInt(process.env.COMMUNICATION_SERVICE_PORT) || 5003;

const app = express();

// ── Middleware ────────────────────────────────────────────────
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Routes ────────────────────────────────────────────────────
app.use("/api", apiLimiter);
app.use("/api/admin", adminPaymentRoutes); // /payments + /payment-gateways
app.use("/api/admin/support", adminSupportRoutes);
app.use("/api/candidate/notifications", candidateNotificationRoutes);
app.use("/api/candidate/support", candidateSupportRoutes);
app.use("/api/candidate/payments", candidatePaymentRoutes);

// ── Health ────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({
    success: true,
    service: "Communication & Payment Service",
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
  await connectRabbitMQ();

  const httpServer = http.createServer(app);
  initSocket(httpServer);

  httpServer.on("error", (err) => {
    if (err.code === "EADDRINUSE")
      logger.error(`Port ${PORT} already in use. Run: npm run kill-ports`);
    else logger.error(`Server error: ${err.message}`);
    process.exit(1);
  });

  httpServer.listen(PORT, () => {
    logger.info(`💬 Communication & Payment Service running on port ${PORT}`);
    console.log(`💬 Communication & Payment Service: http://localhost:${PORT}`);
  });
};

startServer().catch((err) => {
  logger.error(`Failed to start Communication Service: ${err.message}`);
  process.exit(1);
});

module.exports = app;
