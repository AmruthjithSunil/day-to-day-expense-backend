const User = require("../models/user");
const Expense = require("../models/expense");
const sequelize = require("sequelize");

exports.getLeaderboard = async (req, res) => {
  console.log("getting leaderboard");
  const userlist = await User.findAll({
    attributes: [
      "name",
      [sequelize.fn("sum", sequelize.col("expenses.amount")), "totalExpense"],
    ],
    include: [
      {
        model: Expense,
        attributes: [],
      },
    ],
    group: ["email"],
    order: [["totalExpense", "DESC"]],
  });
  const users = userlist.map((user) => user.dataValues);
  res.json(users);
};
