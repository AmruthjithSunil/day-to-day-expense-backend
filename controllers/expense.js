const Expense = require("../models/expense");

exports.postExpense = async (req, res, next) => {
  try {
    console.log("Adding new expense");
    const { amount, description, category, userEmail } = req.body;
    const result = await Expense.create({
      amount: amount,
      description: description,
      category: category,
      userEmail: userEmail,
    });
    console.log("Added New Expense");
    res.json(result);
  } catch (err) {
    console.log("Failed to add new expense");
    console.log(err);
    res.json(err.errors[0].validatorKey);
  }
};

exports.getExpense = async (req, res, next) => {
  try {
    console.log("Fetching all expenses");
    const userEmail = req.body.userEmail;
    const expenses = await Expense.findAll({ where: { userEmail: userEmail } });
    res.json(expenses);
    console.log("Fetched all expenses");
  } catch (err) {
    console.log("Failed to get all expenses");
    console.log(err);
    res.json(err.errors[0].validatorKey);
  }
};

exports.deleteExpense = async (req, res, next) => {
  try {
    const id = req.params.id;
    console.log(`Deleting Expense with id:${id}`);
    const expense = await Expense.findByPk(id);
    if (expense.dataValues.userEmail == req.body.userEmail)
      await expense.destroy();
    else {
      console.log("Failed to delete expense (wrong email)");
    }
    console.log(`Deleted Expense with id:${id}`);
    res.send();
  } catch (err) {
    console.log("Failed to delete expense");
    console.log(err);
    res.json(err.errors[0].validatorKey);
  }
};

exports.getUser = (req, res) => {
  try {
    console.log("sending user");
    res.json({ userEmail: req.body.userEmail });
  } catch (err) {
    console.log(err);
  }
};
