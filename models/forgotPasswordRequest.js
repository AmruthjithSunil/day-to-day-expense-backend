const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const ForgotPasswordRequest = sequelize.define("forgotPasswordRequest", {
  id: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  },
});

module.exports = ForgotPasswordRequest;
