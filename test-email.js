require('dotenv').config();
const nodemailer = require('nodemailer');

async function test() {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"LVHUNGATC" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `Test Email từ hệ thống`,
      text: `Đây là email test để kiểm tra tính năng gửi thư.`,
    });
    console.log("Email test sent successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error sending email:", error);
    process.exit(1);
  }
}

test();
