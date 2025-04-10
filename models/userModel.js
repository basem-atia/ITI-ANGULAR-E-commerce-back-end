const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "username must be entered"],
    minLength: [3, "name must be more than 3 characters"],
    match: [/^[a-zA-Z]+$/, "Username must contain only letters (a-z, A-Z)"],
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    match: [
      /^\+?[0-9]{11}|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "email must be as example@example.com",
    ],
  },
  phone: {
    type: String,
    unique: true,
    sparse: true,
    match: [
      /^(010|011|012|015)\d{8}$/,
      "phone must be 11 number and start with 011,012,010,015",
    ],
  },
  password: {
    type: String,
    required: [true, , "username must be entered"],
    minLength: [8, "password should of minimum length 8"],
    match:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  },
});
userSchema.pre("save", async function (next) {
  console.log("before", this.password);
  this.password = await bcrypt.hash(this.password, 10);
  console.log("after", this.password);
  next();
});
const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
