const speakeasy = require("speakeasy");
const jwt = require("jsonwebtoken");
const ApiError = require("../../utils/ApiError");
const { hashPassword, comparePassword } = require("../../utils/password");
const { signAccessToken, signRefreshToken } = require("../../utils/jwt");
const { generateOtp, storeOtp, verifyOtp } = require("../../utils/otp");
const repo = require("./auth.repository");
const { sendOtpEmail } = require("./auth.notify");

async function signup({ email, phone, password, role, fullName }) {
  const existing = await repo.findUserByEmail(email);
  let user;

  const passwordHash = await hashPassword(password);

  if (existing) {
    if (existing.isVerified) {
      throw new ApiError(409, "An account with this email already exists");
    }
    user = await repo.updateUnverifiedUserWithProfile(existing.id, { email, phone, passwordHash, role, fullName });
  } else {
    user = await repo.createUserWithProfile({ email, phone, passwordHash, role, fullName });
  }

  const otp = generateOtp();
  await storeOtp(email, otp);
  
  // For development: Print OTP to console so you can test without real SMTP
  console.log(`\n\n================================`);
  console.log(`🔑 DEV OTP for ${email}: ${otp}`);
  console.log(`================================\n\n`);

  try {
    await sendOtpEmail(email, otp);
  } catch (err) {
    console.warn("⚠️ SMTP not configured correctly, email skipped.");
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    devOtp: process.env.NODE_ENV === "development" ? otp : undefined,
  };
}

async function verifySignupOtp({ identifier, otp }) {
  const isValid = await verifyOtp(identifier, otp);
  if (!isValid) throw new ApiError(400, "Invalid or expired OTP");

  const user = await repo.findUserByEmail(identifier);
  if (!user) throw new ApiError(404, "User not found");

  await repo.markUserVerified(user.id);
  return issueTokens(user);
}

async function login({ email, password }) {
  const user = await repo.findUserByEmail(email);
  if (!user) throw new ApiError(401, "Invalid email or password");

  const isMatch = await comparePassword(password, user.passwordHash);
  if (!isMatch) throw new ApiError(401, "Invalid email or password");

  if (!user.isVerified) throw new ApiError(403, "Please verify your account first");

  if (user.twoFactorEnabled) {
    return { requiresTwoFactor: true, userId: user.id };
  }

  return issueTokens(user);
}

async function verifyTwoFactor({ userId, token }) {
  const user = await repo.findUserById(userId);
  if (!user || !user.twoFactorSecret) throw new ApiError(400, "2FA not configured");

  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: "base32",
    token,
    window: 1,
  });

  if (!verified) throw new ApiError(401, "Invalid 2FA code");
  return issueTokens(user);
}

async function enableTwoFactor(userId) {
  const secret = speakeasy.generateSecret({ name: "Foundic Execution OS" });
  await repo.enableTwoFactor(userId, secret.base32);
  return { otpauthUrl: secret.otpauth_url, base32: secret.base32 };
}

async function forgotPassword({ email }) {
  const user = await repo.findUserByEmail(email);
  if (!user) return;

  const resetToken = jwt.sign({ id: user.id }, process.env.JWT_ACCESS_SECRET, { expiresIn: "15m" });
  await sendOtpEmail(email, `Reset your password: ${resetToken}`);
}

async function resetPassword({ token, newPassword }) {
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch {
    throw new ApiError(400, "Invalid or expired reset token");
  }
  const passwordHash = await hashPassword(newPassword);
  await repo.updatePassword(decoded.id, passwordHash);
}

function issueTokens(user) {
  const payload = { id: user.id, role: user.role };
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
    user: { id: user.id, email: user.email, role: user.role },
  };
}

module.exports = {
  signup,
  verifySignupOtp,
  login,
  verifyTwoFactor,
  enableTwoFactor,
  forgotPassword,
  resetPassword,
};