const mongoose = require("mongoose");
require("dotenv").config({ path: ".env" });
const dbConnectionString = process.env.dbConnectionString;
console.log(dbConnectionString);

const connectDb = async () => {
  try {
    await mongoose.connect(dbConnectionString);
  } catch (error) {
    throw error;
  }
};
module.exports = connectDb;
