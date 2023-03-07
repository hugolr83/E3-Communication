const request = require("supertest");
const app = require("../app")
const nock = require("nock")
const smsClient = require('../controllers/smsclient')
const answerToSay = require('../controllers/answerToSay')
const Twilio = require('twilio')
const sgMail = require('@sendgrid/mail');
const endpointUrl = "/twilio/";
const MessagingResponse = Twilio.twiml.MessagingResponse;
const VoiceResponse = Twilio.twiml.VoiceResponse;


const encodings = require('../node_modules/iconv-lite/encodings');                                                                                                                                                                       
const iconvLite = require('../node_modules/iconv-lite/lib');                                                                                                                                                                             
const e = require("express");
iconvLite.getCodec('UTF-8');

const callResultMock = {
    sid: 'AC-lorem-ipsum',
  };


//  beforeEach((done) => {
//      server = app.listen(4000, (err) => {
//          if (err) return done(err);


//          agent = request.agent(server);
//          done();
//      });
//  });

// afterEach((done) => {
//     return  server && server.close(done);
// });
  

describe(endpointUrl, () => {

    it("valid password q1", async () =>{
        jest.mock('twilio')

        smsClient.calls.create = jest.fn().mockResolvedValue({ ...callResultMock });

        nock('http://nodeserver:8081')
            .get('/api/user/current')
            .reply(200, {payload: {userInfo :
                {
                    question: 1,
                    answer: "batman",
                    phone: '+15141234567'
                }}
            })

        const twiml = new MessagingResponse()
        const expectedResponse = ['batman', '+15141234567', 'token123']

        await request(app).post(endpointUrl)
            .send({token: 'token123', phone: '+15141234567'})
            .set('Accept', 'application/json')
            .expect(200)
            .expect(expectedResponse)
    });

    it("valid password q2", async () =>{
        jest.mock('twilio')

        smsClient.calls.create = jest.fn().mockResolvedValue({ ...callResultMock });

        nock('http://nodeserver:8081')
            .get('/api/user/current')
            .reply(200, {payload: {userInfo :
                {
                    question: 2,
                    answer: "batman",
                    phone: '+15141234567'
                }}
            })

        const twiml = new MessagingResponse()
        const expectedResponse = ['batman', '+15141234567', 'token123']

        await request(app).post(endpointUrl)
            .send({token: 'token123', phone: '+15141234567'})
            .set('Accept', 'application/json')
            .expect(200)
            .expect(expectedResponse)
            // .end(done);
    });
    it("valid password q3", async () =>{
        jest.mock('twilio')

        smsClient.calls.create = jest.fn().mockResolvedValue({ ...callResultMock });

        nock('http://nodeserver:8081')
            .get('/api/user/current')
            .reply(200, {payload: {userInfo :
                {
                    question: 3,
                    answer: "batman",
                    phone: '+15141234567'
                }}
            })

        const twiml = new MessagingResponse()
        const expectedResponse = ['batman', '+15141234567', 'token123']

        await request(app).post(endpointUrl)
            .send({token: 'token123', phone: '+15141234567'})
            .set('Accept', 'application/json')
            .expect(200)
            .expect(expectedResponse)
            // .end(done);
    });
    it("response question (valid)", async () =>{
        jest.mock('twilio')
        const twiml = new VoiceResponse()
        const expectedResponse = twiml.say('Bonne réponse !').toString();

        answerToSay.get = jest.fn().mockReturnValue(['batman', '+15141234567', 'token123']);
        answerToSay.toLowerCase = jest.fn().mockReturnValue("batman");

        await request(app).get(endpointUrl + "question")
            .query({
                CallSid: '123',
                SpeechResult: 'batman'
            })
            .set('Accept', 'application/json')
            .expect(200)
            .expect(expectedResponse)
    });
    it("valid password", async () =>{
        jest.mock('twilio')

        smsClient.calls.create = jest.fn().mockResolvedValue({ ...callResultMock });

        nock('http://nodeserver:8081')
            .get('/api/user/current')
            .reply(200, {payload: {userInfo :
                {
                    question: 4,
                    answer: "batman",
                    phone: '+15141234567'
                }}
            })

        const twiml = new MessagingResponse()
        const expectedResponse = ['batman', '+15141234567', 'token123']

        await request(app).post(endpointUrl)
            .send({token: 'token123', phone: '+15141234567'})
            .set('Accept', 'application/json')
            .expect(200)
            .expect(expectedResponse)
            // .end(done);
    });
    it("response question (invalid)", async () =>{
        jest.mock('twilio')
        const twiml = new VoiceResponse()
        const expectedResponse = twiml.say('Mauvaise réponse !').toString();

        answerToSay.get = jest.fn().mockReturnValue(['ironman', '+15141234567', 'token123']);
        answerToSay.toLowerCase = jest.fn().mockReturnValue('ironman');

        await request(app).get(endpointUrl + "question")
            .query({
                CallSid: '123',
                SpeechResult: 'batman'
            })
            .set('Accept', 'application/json')
            .expect(200)
            .expect(expectedResponse)
    });

    it("validateID", async () =>{
        nock('https://studio.twilio.com')
            .post('/v2/Flows/FW44f622754aa30e172872782a693e4d65/Executions')
            .reply(200)

        await request(app).post(endpointUrl + "validateID")
            .query({
                phone:'+15141234567'
            })
            .set('Accept', 'application/json')
            .expect(200)
            .expect('{"status":"OK"}')
    });

    it("sendOtp", async () =>{
        jest.mock('@sendgrid/mail')
        sgMail.send = jest.fn().mockResolvedValue({ });

        await request(app).post(endpointUrl + "sendOtp")
            .query({
                list:['21','22','23'],
                name: "TestName",
                email: "test@example.com"
            })
            .set('Accept', 'application/json')
            .expect(200)
            .expect('{"status":"Email sent"}')
    });

})