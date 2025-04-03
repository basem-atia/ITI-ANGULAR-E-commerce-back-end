const Category = require("../models").category;
const Product = require("../models").product;
const statusCode = require("../constant/statusCode");
const create = async (req, res) => {
  try {
    await Category.create({ ...req.body });
    res.status(statusCode.created).json({ message: "created" });
  } catch (error) {
    res.status(statusCode.badRequest).json({ message: error.message });
  }
};
const getAll = async (req, res) => {
  try {
    const categories = await Category.find();
    categories.sort((a, b) => a.name.localeCompare(b.name));
    const data = [];
    for (let i = 0; i < categories.length; i++) {
      const products = await Product.find()
        .populate({
          path: "subCategoryId",
          match: {
            categoryId: categories[i].id,
          },
          select: { _id: 1 },
        })
        .select({ updatedAt: 0 });
      const someProducts = products.filter((p) => p.subCategoryId).slice(0, 4);
      data.push({ ...categories[i]._doc, someProducts });
    }
    res.status(statusCode.ok).json({ data });
  } catch (error) {
    res.status(statusCode.badRequest).json({ message: error.message });
  }
};

module.exports = { create, getAll };
