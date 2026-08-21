const otpGenerator = require("otp-generator");
const redis = require("../config/redis");

const OTP_TTL_SECONDS = 300; // 5 minutes

function generateOtp() {
  return otpGenerator.generate(6, {
    digits: true,
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });
}

async function storeOtp(identifier, otp) {
  await redis.set(`otp:${identifier}`, otp, "EX", OTP_TTL_SECONDS);
}

async function verifyOtp(identifier, otp) {
  const stored = await redis.get(`otp:${identifier}`);
  if (!stored || stored !== otp) return false;
  await redis.del(`otp:${identifier}`);
  return true;
}

module.exports = { generateOtp, storeOtp, verifyOtp };