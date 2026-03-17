require("dotenv").config() //without this cannot access any varaible inside .env file

const mongoose = require("mongoose");

const connectToDb = require("./src/config/database");

const app = require("./src/app");

connectToDb();

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
