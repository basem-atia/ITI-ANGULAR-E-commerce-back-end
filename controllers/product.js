const Product = require("../models").product;
const statusCode = require("../constant/statusCode");
const create = async (req, res) => {
  try {
    await Product.create(req.body);
    res.status(statusCode.created).json({ message: "created" });
  } catch (error) {
    res.status(statusCode.badRequest).json({ message: error.message });
  }
};
const getById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(statusCode.created).json({ data: product });
  } catch (error) {
    res.status(statusCode.badRequest).json({ message: error.message });
  }
};
const getAllByCategoryId = async (req, res) => {
  try {
    const products = await Product.find()
      .populate({
        path: "subCategoryId",
        match: { categoryId: req.params.id },
        select: { _id: 1 },
      })
      .select({ updatedAt: 0 });

    res
      .status(statusCode.ok)
      .json({ data: products.filter((p) => p.subCategoryId) });
  } catch (error) {
    res.status(statusCode.badRequest).json({ message: error.message });
  }
};

module.exports = { create, getAllByCategoryId, getById };
