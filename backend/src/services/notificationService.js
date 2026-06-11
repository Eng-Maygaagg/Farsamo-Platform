const Notification = require('../models/Notification');
const { sendEmail } = require('./emailService');
const { sendSMS } = require('./smsService');

const createNotification = async ({ userId, type, title, message, data = {}, channels = {} }) => {
  const notification = await Notification.create({
    userId,
    type,
    title,
    message,
    data,
    channels: {
      email: channels.email || false,
      sms: channels.sms || false,
      inApp: channels.inApp !== false,
    },
  });

  if (channels.email) {
    try {
      const user = await require('../models/User').findById(userId);
      if (user?.email) await sendEmail(user.email, title, message);
      notification.channels.email = true;
      await notification.save();
    } catch (err) {
      console.error('Email notification failed:', err.message);
    }
  }

  if (channels.sms) {
    try {
      const user = await require('../models/User').findById(userId);
      if (user?.phone) await sendSMS(user.phone, message);
      notification.channels.sms = true;
      await notification.save();
    } catch (err) {
      console.error('SMS notification failed:', err.message);
    }
  }

  return notification;
};

module.exports = { createNotification };
