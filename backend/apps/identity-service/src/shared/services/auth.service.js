const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Employee = require("../models/Employee");
const ApiError = require("../utils/ApiError");
const { generateOTP } = require("../utils/helpers");
const { publishToQueue, QUEUES } = require("../config/rabbitmq");
const { getRedis } = require("../config/redis");
const { sendOTPEmail, sendPasswordResetEmail } = require("./email.service");
const env = require("../config/env");

// ── Token helpers ─────────────────────────────────────────────

const generateAccessToken = (payload) =>
  jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  });

const generateRefreshToken = (payload) =>
  jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });

const generateTokenPair = (payload) => ({
  accessToken: generateAccessToken(payload),
  refreshToken: generateRefreshToken(payload),
});

// ── Cookie options ────────────────────────────────────────────

const cookieOptions = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: env.isProduction ? "strict" : "lax",
};

const setAuthCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000, // 15 min
  });
  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

const clearAuthCookies = (res) => {
  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);
};

// ── Candidate Auth ────────────────────────────────────────────

const registerCandidate = async ({ email, password, registeredMobile }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, "Email already registered");

  const user = await User.create({
    email,
    password,
    registeredMobile,
    role: "candidate",
  });

  // Send OTP for email verification
  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

  user.otp = otp;
  user.otpExpiry = otpExpiry;
  await user.save({ validateBeforeSave: false });

  // Send OTP email directly (not queued for immediate delivery)
  await sendOTPEmail(email, otp, email);

  return { userId: user._id, email: user.email };
};

const verifyOTP = async ({ email, otp }) => {
  const user = await User.findOne({ email }).select("+otp +otpExpiry");
  if (!user) throw new ApiError(404, "User not found");
  if (!user.otp || user.otp !== otp) throw new ApiError(400, "Invalid OTP");
  if (user.otpExpiry < new Date()) throw new ApiError(400, "OTP expired");

  user.isEmailVerified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save({ validateBeforeSave: false });

  const payload = { id: user._id, email: user.email, role: "candidate" };
  const { accessToken, refreshToken } = generateTokenPair(payload);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken, user: user.toSafeObject() };
};

const loginCandidate = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password +refreshToken");
  if (!user) throw new ApiError(401, "Invalid email or password");
  if (!user.isActive) throw new ApiError(403, "Account is deactivated");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new ApiError(401, "Invalid email or password");

  const payload = { id: user._id, email: user.email, role: "candidate" };
  const { accessToken, refreshToken } = generateTokenPair(payload);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken, user: user.toSafeObject() };
};

// ── Admin / Employee Auth ─────────────────────────────────────

const loginAdmin = async ({ email, password }) => {
  const employee = await Employee.findOne({ officialEmail: email }).select(
    "+password +refreshToken",
  );
  if (!employee) throw new ApiError(401, "Invalid credentials");
  if (employee.status !== "Active")
    throw new ApiError(403, "Account is not active");

  const isMatch = await employee.comparePassword(password);
  if (!isMatch) throw new ApiError(401, "Invalid credentials");

  const payload = {
    id: employee._id,
    email: employee.officialEmail,
    role: "employee",
    employeeId: employee.employeeId,
  };
  const { accessToken, refreshToken } = generateTokenPair(payload);

  employee.refreshToken = refreshToken;
  await employee.save({ validateBeforeSave: false });

  return { accessToken, refreshToken, employee: employee.toSafeObject() };
};

// ── Shared Auth ───────────────────────────────────────────────

const refreshAccessToken = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) throw new ApiError(401, "Refresh token required");

  let decoded;
  try {
    decoded = jwt.verify(incomingRefreshToken, env.JWT_REFRESH_SECRET);
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  // Find in User or Employee
  let entity;
  if (decoded.role === "candidate") {
    entity = await User.findById(decoded.id).select("+refreshToken");
  } else {
    entity = await Employee.findById(decoded.id).select("+refreshToken");
  }

  if (!entity || entity.refreshToken !== incomingRefreshToken) {
    throw new ApiError(401, "Refresh token mismatch");
  }

  const payload = {
    id: entity._id,
    email: entity.email || entity.officialEmail,
    role: decoded.role,
    ...(decoded.employeeId && { employeeId: decoded.employeeId }),
  };

  const { accessToken, refreshToken } = generateTokenPair(payload);
  entity.refreshToken = refreshToken;
  await entity.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

const logout = async (userId, role) => {
  if (role === "candidate") {
    await User.findByIdAndUpdate(userId, { refreshToken: null });
  } else {
    await Employee.findByIdAndUpdate(userId, { refreshToken: null });
  }
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "No account found with this email");

  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  user.otp = otp;
  user.otpExpiry = otpExpiry;
  await user.save({ validateBeforeSave: false });

  await publishToQueue(QUEUES.EMAIL, {
    type: "forgot_password",
    to: email,
    otp,
  });

  return { message: "OTP sent to your email" };
};

const resetPassword = async ({ email, otp, newPassword }) => {
  const user = await User.findOne({ email }).select("+otp +otpExpiry");
  if (!user) throw new ApiError(404, "User not found");
  if (!user.otp || user.otp !== otp) throw new ApiError(400, "Invalid OTP");
  if (user.otpExpiry < new Date()) throw new ApiError(400, "OTP expired");

  user.password = newPassword;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  return { message: "Password reset successful" };
};

module.exports = {
  registerCandidate,
  verifyOTP,
  loginCandidate,
  loginAdmin,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
  generateTokenPair,
  setAuthCookies,
  clearAuthCookies,
};
