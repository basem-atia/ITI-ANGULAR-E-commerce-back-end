const mongoose = require("mongoose");
const resetPasswordSchema = new mongoose.Schema({
  email: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,

  },
  resetToken: {
    type: String,
    required: true,
    unique: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});
module.exports = mongoose.model("ResetPassword", resetPasswordSchema);

