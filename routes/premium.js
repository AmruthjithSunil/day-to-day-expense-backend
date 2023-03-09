const express = require("express");

const controller = require("../controllers/premium");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/leaderboard", auth.authenticate, controller.getLeaderboard);

module.exports = router;
