
var express = require("express");
const router = express.Router();
const totpController = require("../controllers/totp.controller")

router.post("/init", totpController.init);
router.post("/verify", totpController.verify);

module.exports = router;