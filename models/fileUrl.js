const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const FileUrl = sequelize.define("fileUrl", {
  fileUrl: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
  },
});

module.exports = FileUrl;
