const express = require("express");
const twillioRouter = require("./routes/twillio.routes");
const totpRouter = require("./routes/totp.routes");
const bodyParser = require('body-parser')

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use("/twilio", twillioRouter)
app.use("/totp", totpRouter)


module.exports = app;



