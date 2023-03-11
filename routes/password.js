const express = require("express");

const controller = require("../controllers/password");

const router = express.Router();

router.post("/forgotpassword", controller.postForgotPassword);

module.exports = router;
