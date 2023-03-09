const express = require("express");

const controller = require("../controllers/user");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/signup", controller.postUserSignup);
router.post("/login", controller.postUserLogin);
router.post("/ispremium", controller.getIsPremium);

module.exports = router;
