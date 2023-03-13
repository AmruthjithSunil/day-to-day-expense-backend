const express = require("express");

const controller = require("../controllers/password");

const router = express.Router();

router.post("/forgotpassword", controller.postForgotPassword);
router.get("/resetpassword/:id", controller.resetPassword);
router.post("/updatepassword", controller.updatePassword);

module.exports = router;
