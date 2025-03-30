const statusCode = require("../constant/statusCode");
const SubCategory = require("../models").subCategory;
const create = async (req, res) => {
  try {
    await SubCategory.create({ ...req.body });
    res.status(statusCode.created).json({ message: "created" });
  } catch (error) {
    res.status(statusCode.badRequest).json({ message: error.message });
  }
};

const getAllByCategoryId = async (req, res) => {
  try {
    const subCategories = await SubCategory.find({ categoryId: req.params.id });
    res.status(statusCode.ok).json({ data: subCategories });
  } catch (error) {
    res.status(statusCode.badRequest).json({ message: error.message });
  }
};
module.exports = {
  create,
  getAllByCategoryId,
};
