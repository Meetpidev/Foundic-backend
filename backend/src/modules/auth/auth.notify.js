const nodemailer = require("nodemailer");
const { SMTP_HOST, SMTP_USER, SMTP_PASS } = require("../../config/env");

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
  connectionTimeout: 2000,
  socketTimeout: 3000,
});

async function sendOtpEmail(to, message) {
  try {
    await transporter.sendMail({
      from: SMTP_USER,
      to,
      subject: "Your Foundic verification code",
      text: `Your code: ${message}`,
    });
  } catch (err) {
    console.warn("⚠️ SMTP failed or not configured:", err.message);
  }
}

module.exports = { sendOtpEmail };