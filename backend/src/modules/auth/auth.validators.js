const { z } = require("zod");

const signupSchema = z.object({
  email: z.string().email(),
  phone: z.union([z.string().min(8), z.literal("")]).optional().transform(v => v === "" ? undefined : v),
  password: z.string().min(8),
  role: z.enum(["FOUNDER", "COMPANY", "EXPERT"]), // Foundic Team/Admin created internally
  fullName: z.string().min(2),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const verifyOtpSchema = z.object({
  identifier: z.string(), // email or phone
  otp: z.string().length(6),
});

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

const resetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(8),
});

module.exports = {
  signupSchema,
  loginSchema,
  verifyOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};