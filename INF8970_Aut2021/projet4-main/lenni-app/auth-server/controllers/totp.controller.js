const dotenv = require('dotenv')
dotenv.config()

const smsClient = require('./smsclient');

// @route   POST totp/init
// @desc    Initialise the token for TOTP
// @access  Public
exports.init = (req, res) => {
    smsClient.verify.v2.services(process.env.TWILIO_SERVICE_SID)
        .entities(req.body.userId)
        .newFactors
        .create({
            friendlyName: req.body.friendlyName,
            factorType: 'totp'
            })
        .catch(e => {
            console.log(e)
            return callback(e)
            })
        .then(new_factor => res.send({binding: new_factor.binding, sid: new_factor.sid}))
}

// @route   POST totp/verify
// @desc    Verify if the token works
// @access  Public
exports.verify =  async (req, res) => {
    try {
        const factors = await smsClient.verify.v2.services(process.env.TWILIO_SERVICE_SID)
        .entities(req.body.userId)
        .factors
        .list({pagesize: 500})
        .catch(e => {
            return callback(e)
            })
        smsClient.verify.v2.services(process.env.TWILIO_SERVICE_SID)
            .entities(req.body.userId)
            .factors(factors[factors.length-1].sid)
            .update({authPayload: req.body.code})
            .then(factor => res.send(factor.status))
            .catch(e => {
                console.log(e)
                return callback(e)
                });
    } catch (err) {
        res.status(500).send({ has_error: true, err_msg: 'Server Error: ' + err.message })
    }
}
