const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function generateAccessToken(userEmail) {
  return jwt.sign({ userEmail: userEmail }, "shhhhh");
}

exports.postUserSignup = (req, res, next) => {
  try {
    console.log("Adding New User");
    const { email, name, password } = req.body;
    let encryptedPassword;
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      encryptedPassword = hash;
      const result = await User.create({
        email: email,
        name: name,
        password: encryptedPassword,
      });
      console.log("Added New User");
      res.send("Added New User");
    });
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
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          console.log("User Login Successful");
          //res.send("User Login Successful");
          res.json({
            message: "User Login Successful",
            token: generateAccessToken(email),
          });
        } else {
          console.log("User not authorized");
          res.status(401).send("User not authorized");
        }
      });
    }
  } catch (err) {
    console.log("Failed to login user");
    console.log(err);
    res.json(err.errors[0].validatorKey);
  }
};

exports.getIsPremium = async (req, res) => {
  try {
    const { userEmail } = req.body;
    const user = await User.findByPk(userEmail);
    console.log(userEmail);
    res.json({ isPremium: user.isPremium });
  } catch (error) {
    console.log(error);
  }
};
