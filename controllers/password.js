const { v4: uuidv4 } = require("uuid");
const Sib = require("sib-api-v3-sdk");
const bcrypt = require("bcrypt");
// const sequelize = require("../utils/database");
const ForgotPasswordRequest = require("../models/forgotPasswordRequest");
const User = require("../models/user");
require("dotenv").config();

exports.postForgotPassword = async (req, res) => {
  console.log(req.body);

  const client = Sib.ApiClient.instance;
  const apiKey = client.authentications["api-key"];
  apiKey.apiKey = process.env.SIB_API_KEY;
  const tranEmailApi = new Sib.TransactionalEmailsApi();
  const sender = {
    email: "amruthjithsunil@gmail.com",
  };
  const receivers = [req.body];

  const id = uuidv4();

  ForgotPasswordRequest.create({
    id: id,
    userEmail: req.body.email,
  });

  await tranEmailApi.sendTransacEmail({
    sender,
    to: receivers,
    subject: "reset password",
    textContent: `click the link to reset the password http://localhost:3000/password/resetpassword/${id}`,
  });
  res.json();
};

exports.resetPassword = async (req, res) => {
  console.log("resetting password");
  const id = req.params.id;
  const forgotPasswordRequest = await ForgotPasswordRequest.findByPk(id);
  console.log(forgotPasswordRequest.dataValues);
  if (forgotPasswordRequest.dataValues.isActive) {
    res.send(`
    <form id="newPasswordForm">
      <input id="password" type="text" />
      <input type="hidden" id="id" value="${id}" />
      <button type="submit">submit new password</button>
    </form>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script>
      document
        .getElementById("newPasswordForm")
        .addEventListener("submit", function (e) {
          const updatePassword = {
            id: document.getElementById("id").value,
            password: document.getElementById("password").value,
          };
          axios.post(
            "http://localhost:3000/password/updatepassword",
            updatePassword
          );
        });
    </script>
    `);
  }
};

exports.updatePassword = async (req, res) => {
  // const t = await sequelize.transaction();
  try {
    console.log("updating password");
    const { id, password } = req.body;
    const forgotPasswordRequest = await ForgotPasswordRequest.findByPk(id);
    const email = forgotPasswordRequest.dataValues.userEmail;
    const saltRounds = 10;
    const user = await User.findByPk(email);
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      await user.update(
        {
          password: hash,
        }
        // {
        //   transaction: t,
        // }
      );
      console.log("updated password");
      res.send();
    });
    forgotPasswordRequest.update(
      {
        isActive: false,
      }
      // {
      //   transaction: t,
      // }
    );
    // await t.commit();
  } catch (err) {
    console.log(err);
    // await t.rollback();
  }
};
