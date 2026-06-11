const sendSMS = async (phone, message) => {
  if (!process.env.SMS_API_KEY) {
    console.log(`[SMS Mock] To: ${phone} | Message: ${message}`);
    return { mock: true };
  }

  // Integrate with SMS provider (Twilio, Africa's Talking, etc.)
  console.log(`[SMS] Sending to ${phone}: ${message}`);
  return { success: true };
};

module.exports = { sendSMS };
