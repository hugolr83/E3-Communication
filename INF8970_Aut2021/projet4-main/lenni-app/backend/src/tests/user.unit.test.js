const request = require("supertest");
const nock = require("nock")
//const app = require("../server")
const endpointUrl = "/api/user";

beforeEach(async (done) => {
    /*
    server = app.listen(4000, (err) => {
        if (err) return done(err);

        agent = request.agent(server);
        done();
    });
    request.post({
        url: 'http://nodeserver:8081/api/auth',
        json: {"username":"alex.ta", "password":"password"}
    }, (error, response, body) =>{
        callback(null, body.has_errors);
    })
    */
    const userInfo = await fetch('http://nodeserver:8081/api/auth', {
      method: 'POST',
      json: {"username":"alex.ta", "password":"password"}
    });
    console.log(userInfo.body)

});

afterEach((done) => {
    return  server && server.close(done);
  });

describe(endpointUrl, () => {

    it("GET " + endpointUrl + "/", async () => {
        const response = await request(app).get(endpointUrl);
        expect(response.status).toBe(200);
        expect(response.text).toBe("AUTHSERVER Running")
    })

    it("POST " + endpointUrl + "/verifyOTP", async () =>{
        /*
        request.post({
            url: ngrok+"/nodeserver/api/user/verifyOTP",
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token,
            },
            json: {"code": 322570}
            
        }, (error, response, body) =>{
            callback(null, body.has_errors);
        })
        
                nock('http://nodeserver:8081/')
                .get('/')
                .reply(200, "API Running")
        
                request(app).post(endpointUrl + "/verifyOTP")
                .then((res, err) => {
                    expect(res.status).toBe(200);
                    expect(res.text).toBe("API Running and responding to AUTHSERVER")
        */
        const response = await fetch('http://nodeserver:8081/api/user/VerifyOTP', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': userInfo.body.token
            },
        });
        expect(response).toBe({ has_errors: true, message: "Invalid password"})
    })

})
