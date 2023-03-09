const { Router } = require("express");
const express = require("express");

const controller = require("../controllers/purchase");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/premiummembership", auth.authenticate, controller.getPremium);
router.post(
  "/updatetransactionstatus",
  auth.authenticate,
  controller.updateTransactionStatus
);
router.post(
  "/transactionfailed",
  auth.authenticate,
  controller.transactionFailed
);

module.exports = router;
