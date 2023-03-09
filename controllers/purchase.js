const Razorpay = require("razorpay");
const Order = require("../models/order");
const User = require("../models/user");

exports.transactionFailed = async (req, res) => {
  try {
    console.log("transactionFailed");
    const { order_id } = req.body;
    const order = await Order.findOne({ where: { orderid: order_id } });
    await order.update({ status: "FAILED" });
  } catch (err) {
    console.log(err);
  }
};

exports.updateTransactionStatus = async (req, res) => {
  try {
    console.log("Updating transaction status");
    const { payment_id, order_id } = req.body;
    const order = await Order.findOne({ where: { orderid: order_id } });
    await order.update({ paymentid: payment_id, status: "SUCCESSFUL" });
    const user = await User.findByPk(req.body.userEmail);
    await user.update({ isPremium: true });
    res.status(202).json({ success: true, message: "Transaction Successful" });
  } catch (err) {
    console.log(err);
  }
};

exports.getPremium = (req, res, next) => {
  try {
    console.log("getting premium");
    const rzp = new Razorpay({
      key_id: process.env.KEY_ID,
      key_secret: process.env.KEY_SECRET,
    });
    const amount = 500;
    rzp.orders.create({ amount: amount, currency: "INR" }, (err, order) => {
      if (err) {
        console.log(err);
      }
      Order.create({
        orderid: order.id,
        status: "PENDING",
        userEmail: req.body.userEmail,
      })
        .then(() => {
          return res
            .status(201)
            .json({ order_id: order.id, key_id: rzp.key_id });
        })
        .catch((err) => {
          throw new Error(err);
        });
    });
  } catch (err) {
    console.log("Failed to get premium");
    console.log(err);
    res.json(err.errors[0].validatorKey);
  }
};
