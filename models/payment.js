const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, "Amount is required"],
  },
  currency: {
    type: String,
    required: [true, "Currency is required"],
  },
  paymentIntentId: {
    type: String,
    required: [true, "PaymentIntentId is required"],
  },
  status: {
    type: String,
    required: [true, "Status is required"],
    enum: ["succeeded", "failed", "pending"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Payment", paymentSchema);
