const express = require("express");

const controller = require("../controllers/expense");

const router = express.Router();

router.post("/", controller.postExpense);
router.get("/", controller.getExpense);
router.delete("/:id", controller.deleteExpense);

module.exports = router;
