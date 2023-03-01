const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const User = require("./models/user");
const Expense = require("./models/expense");

const app = express();

const userRoute = require("./routes/user");
const expenseRoute = require("./routes/expense");
const sequelize = require("./utils/database");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use("/user", userRoute);
app.use("/expense", expenseRoute);

User.hasMany(Expense);
Expense.belongsTo(User);

const syncDb = async () => {
  try {
    const port = 3000;
    const result = await sequelize.sync();
    console.log("Database Synced");
    app.listen(port, () => {
      console.log(`Server listening at port: ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
};

syncDb();
