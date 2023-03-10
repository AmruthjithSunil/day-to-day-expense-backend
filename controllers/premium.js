const User = require("../models/user");

exports.getLeaderboard = async (req, res) => {
  console.log("getting leaderboard");
  const userlist = await User.findAll({
    attributes: ["name", "totalExpense"],
    order: [["totalExpense", "DESC"]],
  });
  const users = userlist.map((user) => user.dataValues);
  res.json(users);
};
