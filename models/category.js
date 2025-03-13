const mongoose = require("mongoose");

const schema = {
  name: {
    type: String,
    required: "Enter category name",
    unique: true,
    lowercase: true,
    minLength: 3,
    maxLength: 20,
  },
};

const Schema = new mongoose.Schema(schema);

module.exports = mongoose.model("Category", Schema);
