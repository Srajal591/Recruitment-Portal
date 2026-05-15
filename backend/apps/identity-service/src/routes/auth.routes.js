const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const validate = require("../../../../packages/common/middlewares/validate");
const authenticate = require("../../../../packages/common/middlewares/authenticate");
const { authLimiter, otpLimiter } = require("../../../../packages/common/middlewares/rateLimiter");
const {
  registerSchema,
  verifyOTPSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require("../../../../packages/common/validations/auth.validation");

// ── Public routes ─────────────────────────────────────────────
router.post(
  "/register",
  authLimiter,
  validate(registerSchema),
  authController.register,
);
router.post(
  "/verify-otp",
  otpLimiter,
  validate(verifyOTPSchema),
  authController.verifyOTP,
);
router.post(
  "/login",
  authLimiter,
  validate(loginSchema),
  authController.loginCandidate,
);
router.post(
  "/admin/login",
  authLimiter,
  validate(loginSchema),
  authController.loginAdmin,
);
router.post("/refresh-token", authController.refreshToken);
router.post(
  "/forgot-password",
  otpLimiter,
  validate(forgotPasswordSchema),
  authController.forgotPassword,
);
router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  authController.resetPassword,
);

// ── Protected routes ──────────────────────────────────────────
router.post("/logout", authenticate, authController.logout);
router.get("/me", authenticate, authController.getMe);

module.exports = router;

