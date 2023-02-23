const express = require("express");

const controller = require("../controllers/user");

const router = express.Router();

router.post("/signup", controller.postUserSignup);
router.post("/login", controller.postUserLogin);

module.exports = router;
