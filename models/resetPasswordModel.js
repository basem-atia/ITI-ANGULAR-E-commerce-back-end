const mongoose = require("mongoose");
const resetPasswordSchema = new mongoose.Schema({
  email: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: true,
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
const resetPassModel = mongoose.model("ResetPassword", resetPasswordSchema);
module.exports = resetPassModel;
