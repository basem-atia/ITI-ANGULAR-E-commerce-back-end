const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "UserId is required"],
  },
  items: [
    {
      name: {
        type: String,
        required: [true, "Item name is required"],
      },
      quantity: {
        type: Number,
        required: [true, "Quantity is required"],
        min: [1, "Quantity must be at least 1"],
      },
      price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price must be greater than or equal to 0"],
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: [true, "Total amount is required"],
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment",
    required: [true, "Payment is required"],
  },
  shippingInfo: {
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
    },
    country: {
      type: String,
      required: [true, "Country is required"],
    },
  },
  orderStatus: {
    type: String,
    enum: ["paid", "pending"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
