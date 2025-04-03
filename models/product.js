const mongoose = require("mongoose");
const schema = {
  name: {
    type: String,
    unique: true,
    minLength: 3,
    maxLength: 30,
    required: "Enter product name",
  },
  discount: {
    default: 0,
    type: Number,
  },
  price: {
    require: "Enter product price",
    type: Number,
  },
  image: {
    required: "Enter image url",
    type: String,
  },
  description: {
    required: "Enter description",
    type: String,
    minLength: 10,
  },
  deliveryIsFree: {
    type: Boolean,
    default: false,
  },
  isUsed: {
    type: Boolean,
    default: false,
  },
  subCategoryId: {
    type: mongoose.Types.ObjectId,
    required: "Enter subCategoryId",
    ref: "Subcategory",
  },
};
const Schema = new mongoose.Schema(schema, { timestamps: true });

module.exports = mongoose.model("Product", Schema);
