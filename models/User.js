const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Username is required"],
    minlength: [3, "Username must be at least 3 characters long"],
    match: [/^[a-zA-Z ]+$/, "Username can only contain letters"],
    trim: true,
  },
  emailPhone: {
    type: String,
    required: [true, "Email or phone number is required"],
    match: [
      /^(?:\+?[0-9]{11}|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
      "Invalid email or phone number",
    ],
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters long"],
  },
});

module.exports = mongoose.model("User", userSchema);
