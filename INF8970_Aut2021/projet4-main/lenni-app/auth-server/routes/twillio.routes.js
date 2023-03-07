
var express = require("express");
const router = express.Router();
const twillioController = require("../controllers/twillio.controller")

router.get("/question", twillioController.smsResponseQuestion);
router.post("/validateID", twillioController.validateID);
router.post("/", twillioController.defaultPOST);
router.post("/sendOtp", twillioController.sendOtp)


module.exports = router;
