const Twilio = require('twilio')

const MessagingResponse = Twilio.twiml.MessagingResponse;
const VoiceResponse = Twilio.twiml.VoiceResponse;

const smsClient = new Twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

const messagingReponse = new MessagingResponse()
const voiceReponse = new VoiceResponse()

module.exports = smsClient

//export { smsClient };
//export { messagingReponse };
//export { voiceReponse };
