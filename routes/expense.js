const express = require("express");

const controller = require("../controllers/expense");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth.authenticate, controller.postExpense);
router.get("/page/:page", auth.authenticate, controller.getExpense);
router.get("/download", auth.authenticate, controller.downloadExpense);
router.get("/daily", auth.authenticate, controller.getDailyExpense);
router.delete("/:id", auth.authenticate, controller.deleteExpense);
router.get("/user", auth.authenticate, controller.getUser);
router.get(
  "/download-history",
  auth.authenticate,
  controller.getDownloadHistory
);

module.exports = router;
