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
    res.send("Added New User");
  } catch (err) {
    console.log("Failed to add new user");
    console.log(err);
    res.json(err.errors[0].validatorKey);
  }
};

exports.postUserLogin = async (req, res, next) => {
  try {
    console.log("logging in user");
    const { email, password } = req.body;
    const user = await User.findByPk(email);
    if (user === null) {
      console.log("User not found");
      res.sendStatus(404);
    } else {
      if (user.password === password) {
        console.log("User Login Successful");
        res.send("User Login Successful");
      } else {
        console.log("User not authorized");
        res.status(401).send("User not authorized");
      }
    }
  } catch (error) {
    console.log("Failed to login user");
  }
};
