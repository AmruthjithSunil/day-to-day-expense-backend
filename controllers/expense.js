const Expense = require("../models/expense");
const User = require("../models/user");
const sequelize = require("../utils/database");
const FileUrl = require("../models/fileUrl");
const AWS = require("aws-sdk");

exports.postExpense = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    console.log("Adding new expense");
    const { amount, description, category, userEmail } = req.body;
    const result = await Expense.create(
      {
        amount: amount,
        description: description,
        category: category,
        userEmail: userEmail,
      },
      {
        transaction: t,
      }
    );
    const user = await User.findByPk(userEmail);
    await user.update(
      {
        totalExpense: parseInt(user.dataValues.totalExpense) + parseInt(amount),
      },
      { transaction: t }
    );
    console.log("Added New Expense");
    res.json(result);
    await t.commit();
  } catch (err) {
    console.log("Failed to add new expense");
    console.log(err);
    res.json(err);
    await t.rollback();
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

exports.getDailyExpense = async (req, res, next) => {
  try {
    console.log("Fetching daily expenses");
    const userEmail = req.body.userEmail;
    //need to change
    const expenses = await Expense.findAll({
      where: { userEmail: userEmail },
      attributes: ["amount", "updatedAt"],
      order: [["updatedAt", "DESC"]],
    });
    console.log(expenses[0]);
    res.json(expenses);
    console.log("Fetched daily expenses");
  } catch (err) {
    console.log("Failed to get all expenses");
    console.log(err);
    res.json(err.errors[0].validatorKey);
  }
};

exports.deleteExpense = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const id = req.params.id;
    console.log(`Deleting Expense with id:${id}`);
    const expense = await Expense.findByPk(id);
    const amount = expense.dataValues.amount;
    if (expense.dataValues.userEmail == req.body.userEmail) {
      await expense.destroy({ transaction: t });
      const user = await User.findByPk(req.body.userEmail);
      const totalExpense = user.dataValues.totalExpense - amount;
      await user.update({ totalExpense: totalExpense }, { transaction: t });
    } else {
      console.log("Failed to delete expense (wrong email)");
    }
    console.log(`Deleted Expense with id:${id}`);
    res.send();
    await t.commit();
  } catch (err) {
    console.log("Failed to delete expense");
    console.log(err);
    res.json(err.errors[0].validatorKey);
    await t.rollback();
  }
};

exports.downloadExpense = async (req, res) => {
  try {
    console.log("downloading expenses");
    const userEmail = req.body.userEmail;
    const expenses = await Expense.findAll({ where: { userEmail: userEmail } });
    const stringifiedExpense = JSON.stringify(expenses);
    const filename = `expense${userEmail}/${new Date()}.txt`;
    const fileUrl = await uploadToS3(stringifiedExpense, filename);
    await FileUrl.create({ fileUrl, userEmail });
    res.status(200).json({ fileUrl: fileUrl, success: true });
  } catch (err) {
    console.log(err);
  }
};

function uploadToS3(data, filename) {
  try {
    const { BUCKET_NAME, IAM_USER_KEY, IAM_USER_SECRET } = process.env;
    let s3bucket = new AWS.S3({
      accessKeyId: IAM_USER_KEY,
      secretAccessKey: IAM_USER_SECRET,
    });
    let params = {
      Bucket: BUCKET_NAME,
      Key: filename,
      Body: data,
      ACL: "public-read",
    };
    return new Promise((resolve, reject) => {
      s3bucket.upload(params, async (err, s3response) => {
        if (err) {
          console.log("Something went wrong", err);
          reject(err);
        } else {
          console.log("Success", s3response);
          resolve(s3response.Location);
        }
      });
    });
  } catch (err) {
    console.log(err);
  }
}

exports.getUser = (req, res) => {
  try {
    console.log("sending user");
    res.json({ userEmail: req.body.userEmail });
  } catch (err) {
    console.log(err);
  }
};

exports.getDownloadHistory = async (req, res) => {
  try {
    const fileUrls = await FileUrl.findAll({
      where: { userEmail: req.body.userEmail },
      attributes: ["fileUrl"],
    });
    console.log(fileUrls);
    res.json(fileUrls);
  } catch (err) {
    console.log(err);
  }
};
