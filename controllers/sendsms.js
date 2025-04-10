const twilio = require("twilio");
const dotenv = require("dotenv");
dotenv.config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);

async function sendSms(phoneNumber, message) {
  try {
    const msg = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: phoneNumber,
    });
    return msg.sid;
  } catch (error) {
    return error.message;
  }
}
module.exports = sendSms;
