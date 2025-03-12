const Category = require("../models/category");

const create = async (req, res) => {
  try {
    await Category.create({ ...req.body });
    res.status(201).json({ message: "created" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { create };
