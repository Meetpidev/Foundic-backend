const nodemailer = require("nodemailer");
const { SMTP_HOST, SMTP_USER, SMTP_PASS } = require("../../config/env");

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
});

async function sendOtpEmail(to, message) {
  await transporter.sendMail({
    from: SMTP_USER,
    to,
    subject: "Your Foundic verification code",
    text: `Your code: ${message}`,
  });
}

module.exports = { sendOtpEmail };