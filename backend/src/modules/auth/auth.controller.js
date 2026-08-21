const service = require("./auth.service");

async function signup(req, res, next) {
  try {
    const result = await service.signup(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function verifyOtp(req, res, next) {
  try {
    const result = await service.verifySignupOtp(req.body);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const result = await service.login(req.body);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function verifyTwoFactor(req, res, next) {
  try {
    const result = await service.verifyTwoFactor(req.body);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function enableTwoFactor(req, res, next) {
  try {
    const result = await service.enableTwoFactor(req.user.id);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function forgotPassword(req, res, next) {
  try {
    await service.forgotPassword(req.body);
    res.status(200).json({ success: true, message: "If the account exists, a reset link was sent" });
  } catch (err) {
    next(err);
  }
}

async function resetPassword(req, res, next) {
  try {
    await service.resetPassword(req.body);
    res.status(200).json({ success: true, message: "Password updated" });
  } catch (err) {
    next(err);
  }
}

module.exports = { signup, verifyOtp, login, verifyTwoFactor, enableTwoFactor, forgotPassword, resetPassword };