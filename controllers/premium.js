const User = require("../models/user");
const Expense = require("../models/expense");

exports.getLeaderboard = async (req, res) => {
  console.log("getting userlist");
  const users = await User.findAll({
    attributes: ["email", "name"],
  });
  const size = users.length;
  let userlist = [];
  for (let i = 0; i < size; i++) {
    const user = users[i].dataValues;
    const expenses = await Expense.findAll({
      where: { userEmail: user.email },
    });
    let total = 0;
    const size = expenses.length;
    for (let i = 0; i < size; i++) {
      total += expenses[i].dataValues.amount;
    }
    userlist.push({ name: user.name, totalExpense: total });
  }
  userlist.sort((a, b) => b.totalExpense - a.totalExpense);
  res.json(userlist);
};
