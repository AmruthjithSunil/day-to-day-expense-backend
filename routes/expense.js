const express = require("express");

const controller = require("../controllers/expense");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth.authenticate, controller.postExpense);
router.get("/", auth.authenticate, controller.getExpense);
router.delete("/:id", auth.authenticate, controller.deleteExpense);
router.get("/user", auth.authenticate, controller.getUser);

module.exports = router;
