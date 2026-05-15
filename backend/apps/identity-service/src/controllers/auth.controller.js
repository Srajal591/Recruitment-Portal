const { StatusCodes } = require("http-status-codes");
const authService = require("../../../../src/services/auth.service");
const { ApiResponse } = require("../../../../packages/common/utils/ApiResponse");
const asyncHandler = require("../../../../packages/common/utils/asyncHandler");
const { emitToAdmins, SOCKET_EVENTS } = require("../../../../packages/common/socket/index");
const logger = require("../../../../packages/common/utils/logger");

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new candidate
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, registeredMobile]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 8 }
 *               registeredMobile: { type: string, example: "9876543210" }
 *     responses:
 *       201: { description: Registration successful, OTP sent }
 *       409: { description: Email already registered }
 */
const register = asyncHandler(async (req, res) => {
  const result = await authService.registerCandidate(req.body);

  try {
    emitToAdmins(SOCKET_EVENTS.ADMIN_LIVE_COUNT, {
      type: "new_registration",
      message: `New candidate registered: ${result.email}`,
      timestamp: new Date(),
    });
  } catch (e) {
    logger.warn("Socket emit failed: " + e.message);
  }

  res
    .status(StatusCodes.CREATED)
    .json(
      new ApiResponse(
        StatusCodes.CREATED,
        "Registration successful. OTP sent to your email.",
        result,
      ),
    );
});

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     tags: [Auth]
 *     summary: Verify OTP and activate account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp]
 *             properties:
 *               email: { type: string }
 *               otp: { type: string, minLength: 6, maxLength: 6 }
 *     responses:
 *       200: { description: OTP verified, tokens returned }
 *       400: { description: Invalid or expired OTP }
 */
const verifyOTP = asyncHandler(async (req, res) => {
  const result = await authService.verifyOTP(req.body);
  authService.setAuthCookies(res, result.accessToken, result.refreshToken);

  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, "OTP verified successfully", {
      user: result.user,
      accessToken: result.accessToken,
    }),
  );
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Candidate login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Login successful }
 *       401: { description: Invalid credentials }
 */
const loginCandidate = asyncHandler(async (req, res) => {
  const result = await authService.loginCandidate(req.body);
  authService.setAuthCookies(res, result.accessToken, result.refreshToken);

  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, "Login successful", {
      user: result.user,
      accessToken: result.accessToken,
    }),
  );
});

/**
 * @swagger
 * /api/auth/admin/login:
 *   post:
 *     tags: [Auth]
 *     summary: Admin / Employee login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Login successful }
 *       401: { description: Invalid credentials }
 */
const loginAdmin = asyncHandler(async (req, res) => {
  const result = await authService.loginAdmin(req.body);
  authService.setAuthCookies(res, result.accessToken, result.refreshToken);

  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, "Admin login successful", {
      user: result.employee,
      accessToken: result.accessToken,
    }),
  );
});

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh access token
 *     responses:
 *       200: { description: New access token issued }
 *       401: { description: Invalid refresh token }
 */
const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;
  const result = await authService.refreshAccessToken(token);
  authService.setAuthCookies(res, result.accessToken, result.refreshToken);

  res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(StatusCodes.OK, "Token refreshed", {
        accessToken: result.accessToken,
      }),
    );
});

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     tags: [Auth]
 *     summary: Request password reset OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string }
 *     responses:
 *       200: { description: OTP sent }
 *       404: { description: Email not found }
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const result = await authService.forgotPassword(req.body.email);
  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, result.message));
});

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     tags: [Auth]
 *     summary: Reset password using OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp, newPassword]
 *             properties:
 *               email: { type: string }
 *               otp: { type: string }
 *               newPassword: { type: string, minLength: 8 }
 *     responses:
 *       200: { description: Password reset successful }
 *       400: { description: Invalid OTP }
 */
const resetPassword = asyncHandler(async (req, res) => {
  const result = await authService.resetPassword(req.body);
  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, result.message));
});

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Logged out }
 */
const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user.id, req.user.role);
  authService.clearAuthCookies(res);
  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, "Logged out successfully"));
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get current authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Current user data }
 */
const getMe = asyncHandler(async (req, res) => {
  let user;
  if (req.user.role === "candidate") {
    const User = require("../../../../packages/common/models/User");
    user = await User.findById(req.user.id);
  } else {
    const Employee = require("../../../../packages/common/models/Employee");
    user = await Employee.findById(req.user.id).populate(
      "systemRole",
      "roleName permissions",
    );
  }

  if (!user) {
    const ApiError = require("../../../../packages/common/utils/ApiError");
    throw new ApiError(404, "User not found");
  }

  res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(StatusCodes.OK, "User fetched", {
        user: user.toSafeObject(),
      }),
    );
});

module.exports = {
  register,
  verifyOTP,
  loginCandidate,
  loginAdmin,
  refreshToken,
  forgotPassword,
  resetPassword,
  logout,
  getMe,
};





