const Expense = require("../models/expense");

exports.postExpense = async (req, res, next) => {
  try {
    console.log("Adding new expense");
    const { amount, description, category } = req.body;
    const result = await Expense.create({
      amount: amount,
      description: description,
      category: category,
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
    const expenses = await Expense.findAll();
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
    expense.destroy();
    console.log(`Deleted Expense with id:${id}`);
    res.send();
  } catch (err) {
    console.log("Failed to delete expense");
    console.log(err);
    res.json(err.errors[0].validatorKey);
  }
};
