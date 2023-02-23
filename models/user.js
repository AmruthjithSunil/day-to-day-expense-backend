const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

exports.User = sequelize.define("user", {
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});
