const Category = require("../models/category");

const create = async (req, res) => {
  try {
    await Category.create({ ...req.body });
    res.status(201).json({ message: "created" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const getAll = async (req, res) => {
  try {
    const data = await Category.find();
    data.sort((a, b) => a.name.localeCompare(b.name));
    res.status(201).json({ data });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { create, getAll };
