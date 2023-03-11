const Sib = require("sib-api-v3-sdk");
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

  await tranEmailApi.sendTransacEmail({
    sender,
    to: receivers,
    subject: "testing email",
    textContent: "email from day to day",
  });
  res.json();
};
