
const request = require("request");
const Twilio = require('twilio')
const dotenv = require('dotenv')
dotenv.config()

const smsClient = require('./smsclient');
const voiceResponse = require('./voiceclient');
const answerToSay = require('./answerToSay');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// @route   POST twilio/validateID
// @desc    Validate ID of user and send validation
// @access  Public
exports.validateID = (req, res, next) => {
  request.post({
        url: 'https://studio.twilio.com/v2/Flows/FW44f622754aa30e172872782a693e4d65/Executions',
        headers: {
            'Content-Type': 'application/json',
          },
        auth: {
            'user': process.env.TWILIO_ACCOUNT_SID,                
            'pass': process.env.TWILIO_AUTH_TOKEN,
            'sendImmediately': true
          },
          form: {
            From: '+14386002674',
            To: req.body.phone,
        },
    }, (error, response2, body) =>{
        res.type('text/json').send({status:'OK'});
    })
};

// @route   GET twilio/question
// @desc    Process the user's answer
// @access  Public  
exports.smsResponseQuestion = (req, res, next) => {
  const VoiceResponse = Twilio.twiml.VoiceResponse;
  const twiml = new VoiceResponse()
  answer = answerToSay.get(req.query.CallSid)[0]
  phoneNumber = answerToSay.get(req.query.CallSid)[1]
  token = answerToSay.get(req.query.CallSid)[2]
  if (req.query.SpeechResult.toLowerCase() == answer.toLowerCase())
  {
      twiml.say('Bonne réponse !');
      res.type('text/xml').send(twiml.toString());
      smsClient.studio.v2.flows('FWd73beea1396e9d988c83e2c8a2941b5e')
                .executions
                .create({parameters: {
                   token: token
                 }, to: phoneNumber, from: '+14502338620'})
                .then(execution => {});
  }
  else
  {
      twiml.say('Mauvaise réponse !');
      res.type('text/xml').send(twiml.toString());
  }
};

// @route   POST twilio/
// @desc    Ask security question
// @access  Public
exports.defaultPOST = (req, res) => {
  request.get({
    url: 'http://nodeserver:8081/api/user/current',
    //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': req.body.token
    },
    }, (error, responseUser, body) =>{
        
        const gather = voiceResponse.gather({
            input: 'speech',
            action: process.env.NGROK_CALLBACK,
            method: 'GET',
            language: 'fr-FR',
            speechModel: 'experimental_utterances'
        });

        question = JSON.parse(responseUser.body).payload.userInfo.question
        answer = JSON.parse(responseUser.body).payload.userInfo.answer
        phoneNumber = JSON.parse(responseUser.body).payload.userInfo.phone

        switch(question){
            case 1: gather.say('Quel est votre film favori ?'); break;
            case 2: gather.say('Dans quelle ville êtes vous né ?'); break;
            case 3: gather.say('Quelle était votre école secondaire ?'); break;
            case 4: gather.say('Quel est le nom de jeune fille de votre mère ?'); break;
        }

        smsClient.calls
        .create({
            twiml: voiceResponse.toString(),
            to: phoneNumber,
            from: '+14386002674'
        })
        .then(call => answerToSay.set(call.sid, [answer, phoneNumber, req.body.token]));
        res.send([answer, phoneNumber, req.body.token])
    })

};

// @route   POST twilio/sendOTP
// @desc    Send OTP list by email
// @access  Public
exports.sendOtp = (req, res, next) => {
  const msg = {
    to: req.body.email,
    from: 'sebastien.zerbato@polymtl.ca',
    subject: 'Lenni-App: New list of one time passwords as requested ',
    dynamic_template_data: {
      OTP: req.body.list,
      user: req.body.name,
    },
    template_id: 'd-dfe99a6ea4b94dafae3f2c0d177f468c'
  }
  sgMail
    .send(msg)
    .then(() => {
      res.status(200).json({status: "Email sent"})
    })
    .catch(() => {})  
};
