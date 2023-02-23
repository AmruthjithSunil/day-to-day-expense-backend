const { User } = require("../models/user");

exports.postUserSignup = async (req, res, next) => {
  try {
    console.log("Adding New User");
    const { email, name, password } = req.body;
    const result = await User.create({
      email: email,
      name: name,
      password: password,
    });
    console.log("Added New User");
    console.log(result.dataValues);
    res.json(result);
  } catch (err) {
    console.log("Failed to add new user");
    console.log(err);
    res.json(err.errors[0].validatorKey);
  }
};
