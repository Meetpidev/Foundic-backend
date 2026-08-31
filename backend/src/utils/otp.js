const otpGenerator = require("otp-generator");
const redis = require("../config/redis");

const OTP_TTL_SECONDS = 300; // 5 minutes
const memoryStore = new Map();

function generateOtp() {
  return otpGenerator.generate(6, {
    digits: true,
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });
}

async function storeOtp(identifier, otp) {
  const expiresAt = Date.now() + OTP_TTL_SECONDS * 1000;
  memoryStore.set(`otp:${identifier}`, { otp, expiresAt });

  try {
    if (redis.status === "ready") {
      await redis.set(`otp:${identifier}`, otp, "EX", OTP_TTL_SECONDS);
    }
  } catch (err) {
    // Fallback to memoryStore when redis is unavailable
  }
}

async function verifyOtp(identifier, otp) {
  let stored = null;

  try {
    if (redis.status === "ready") {
      stored = await redis.get(`otp:${identifier}`);
      if (stored) {
        if (stored === otp) {
          await redis.del(`otp:${identifier}`);
          memoryStore.delete(`otp:${identifier}`);
          return true;
        }
        return false;
      }
    }
  } catch (err) {
    // Redis failed, check memoryStore fallback below
  }

  const memRecord = memoryStore.get(`otp:${identifier}`);
  if (memRecord) {
    if (Date.now() > memRecord.expiresAt) {
      memoryStore.delete(`otp:${identifier}`);
      return false;
    }
    if (memRecord.otp === otp) {
      memoryStore.delete(`otp:${identifier}`);
      return true;
    }
  }

  return false;
}

module.exports = { generateOtp, storeOtp, verifyOtp };