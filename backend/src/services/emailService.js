const nodemailer = require('nodemailer');

let transporter;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
};

const sendEmail = async (to, subject, html) => {
  if (!process.env.SMTP_USER) {
    console.log(`[Email Mock] To: ${to} | Subject: ${subject}`);
    return { mock: true };
  }

  const info = await getTransporter().sendMail({
    from: `"Farsamo Platform" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#2563eb;">Farsamo Platform</h2>
      <p>${html}</p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;">
      <p style="color:#6b7280;font-size:12px;">© Farsamo Platform. All rights reserved.</p>
    </div>`,
  });

  return info;
};

module.exports = { sendEmail };
