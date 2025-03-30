const mongoose = require("mongoose");
const schema = {
  name: {
    type: String,
    required: "Enter category name",
    unique: true,
    lowercase: true,
    trim: true,
    minLength: 3,
    maxLength: 20,
  },
  categoryId: {
    type: mongoose.Types.ObjectId,
    ref: "Category",
  },
};
const Schema = new mongoose.Schema(schema);

module.exports = mongoose.model("Subcategory", Schema);
