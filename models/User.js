const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Username is required"],
    minlength: [3, "Username must be at least 3 characters long"],
    match: [/^[a-zA-Z ]+$/, "Username can only contain letters"],
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    match: [
      /^\+?[0-9]{11}|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "email must be as example@example.com",
    ],
    trim: true,
  },
  phone: {
    type: String,
    unique: true,
    sparse: true,
    match: [
      /^(010|011|012|015)\d{8}$/,
      "phone must be 11 number and start with 011,012,010,015",
    ],
    trim: true,
  },  

  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters long"],
  },
  address: {
    type: String,
    trim: true,
    default: "",
  },
});

module.exports = mongoose.model("User", userSchema);
