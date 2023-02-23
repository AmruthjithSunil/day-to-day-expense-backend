const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

const userRoute = require("./routes/user");
const sequelize = require("./utils/database");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use("/user", userRoute);

const syncDb = async (port) => {
  try {
    const result = await sequelize.sync();
    console.log("Database Synced");
    app.listen(port, () => {
      console.log(`Server listening at port: ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
};

syncDb(3000);
