const jwt = require("jsonwebtoken");

exports.authenticate = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    const { userEmail } = jwt.verify(token, "shhhhh");
    req.body.userEmail = userEmail;
    next();
  } catch (err) {
    console.log(err);
  }
};
