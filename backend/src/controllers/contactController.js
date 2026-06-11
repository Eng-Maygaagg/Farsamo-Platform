const ContactMessage = require('../models/ContactMessage');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { sendEmail } = require('../services/emailService');

const submitContact = asyncHandler(async (req, res) => {
  const message = await ContactMessage.create(req.body);

  await sendEmail(
    process.env.SMTP_USER || 'contact@farsamo.com',
    `Contact: ${req.body.subject}`,
    `From: ${req.body.name} (${req.body.email})<br><br>${req.body.message}`
  );

  res.status(201).json({ success: true, message: 'Message sent successfully', data: message });
});

const getContactMessages = asyncHandler(async (req, res) => {
  const messages = await ContactMessage.find().sort('-createdAt');
  res.json({ success: true, data: messages });
});

const markContactRead = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
  if (!message) throw new ApiError(404, 'Message not found');
  res.json({ success: true, data: message });
});

module.exports = { submitContact, getContactMessages, markContactRead };
