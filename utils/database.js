const Sequelize = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  "day-to-day-expense",
  "root",
  process.env.PASSWORD,
  {
    dialect: "mysql",
    host: "localhost",
  }
);

module.exports = sequelize;
