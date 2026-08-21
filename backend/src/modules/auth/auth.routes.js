const express = require("express");
const controller = require("./auth.controller");
const validate = require("../../middlewares/validate.middleware");
const authMiddleware = require("../../middlewares/auth.middleware");
const {
  signupSchema,
  loginSchema,
  verifyOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require("./auth.validators");

const router = express.Router();

router.post("/signup", validate(signupSchema), controller.signup);
router.post("/verify-otp", validate(verifyOtpSchema), controller.verifyOtp);
router.post("/login", validate(loginSchema), controller.login);
router.post("/2fa/verify", controller.verifyTwoFactor);
router.post("/2fa/enable", authMiddleware, controller.enableTwoFactor);
router.post("/forgot-password", validate(forgotPasswordSchema), controller.forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), controller.resetPassword);

module.exports = router;