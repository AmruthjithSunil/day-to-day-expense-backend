const fs = require("fs");

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const compression = require("compression");
const morgan = require("morgan");

const User = require("./models/user");
const Expense = require("./models/expense");
const Order = require("./models/order");
const ForgotPasswordRequest = require("./models/forgotPasswordRequest");
const FileUrl = require("./models/fileUrl");

const userRoute = require("./routes/user");
const expenseRoute = require("./routes/expense");
const purchaseRoute = require("./routes/purchase");
const premiumRoute = require("./routes/premium");
const passwordRoute = require("./routes/password");

const sequelize = require("./utils/database");

const accessLogStream = fs.createWriteStream("./access.log", { flags: "a" });

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(compression());
app.use(morgan("combined", { stream: accessLogStream }));

app.use("/user", userRoute);
app.use("/expense", expenseRoute);
app.use("/purchase", purchaseRoute);
app.use("/premium", premiumRoute);
app.use("/password", passwordRoute);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgotPasswordRequest);
ForgotPasswordRequest.belongsTo(User);

User.hasMany(FileUrl);
FileUrl.belongsTo(User);

const syncDb = async () => {
  try {
    const port = process.env.PORT || 3000;
    await sequelize.sync();
    console.log("Database Synced");
    app.listen(port, () => {
      console.log(`Server listening at port: ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
};

syncDb();
