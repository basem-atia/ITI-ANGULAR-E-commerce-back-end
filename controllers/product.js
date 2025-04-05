const Product = require("../models").product;
const statusCode = require("../constant/statusCode");
const DB = require("../constant/DB");
const pagination = require("../utils/pagination");
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
const getByIds = async (req, res) => {
  try {
    const products = [];
    const ids = req.body.ids;
    for (var i = 0; i < ids.length; i++) {
      const product = await Product.findById(ids[i]);
      products.push(product);
    }
    res.status(statusCode.created).json({ data: products });
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
    const data = products.filter((p) => p.subCategoryId);
    // .sort((a, b) => a.name.localeCompare(b.name))
    const _pagination = pagination(data.length, req.params.page);
    const prices = {
      min: Math.min(...products.map((p) => p.price)),
      max: Math.max(...products.map((p) => p.price)),
    };
    res.status(statusCode.ok).json({
      data: data.slice(_pagination.start, _pagination.end),
      numberOfPages: _pagination.numberOfPages,
      prices,
    });
  } catch (error) {
    res.status(statusCode.badRequest).json({ message: error.message });
  }
};
const getBySubCategoryId = async (req, res) => {
  try {
    const products = await Product.find({ subCategoryId: req.params.id });
    res.status(statusCode.created).json({ data: products });
  } catch (error) {
    res.status(statusCode.badRequest).json({ message: error.message });
  }
};
const getByFilter = async (req, res) => {
  try {
    const filter = req.body.filter;

    let products = [];
    if (filter.subCategoryId == "all" || filter.subCategoryId == "") {
      products = await Product.find()
        .populate({
          path: "subCategoryId",
          match: { categoryId: filter.categoryId },
          select: { _id: 1 },
        })
        .select({ updatedAt: 0 });
      products = products.filter((p) => p.subCategoryId);
    } else {
      products = await Product.find({
        subCategoryId: filter.subCategoryId,
      });
    }
    if (filter.freeShapping) products = products.filter((p) => p.shipping == 0);
    if (filter.hasDiscount) products = products.filter((p) => p.discount > 0);
    if (filter.userMaxPrice)
      products = products.filter((p) => p.price <= filter.userMaxPrice);

    const _pagination = pagination(products.length, filter.page);
    const prices = {
      min: Math.min(...products.map((p) => p.price)),
      max: Math.max(...products.map((p) => p.price)),
    };
    const data = products.slice(_pagination.start, _pagination.end);
    let numberOfPages = _pagination.numberOfPages;
    if (numberOfPages == 0) numberOfPages = data.length == 0 ? 0 : 1;
    res.status(statusCode.created).json({
      data,
      numberOfPages,
      prices,
    });
  } catch (error) {
    res.status(statusCode.badRequest).json({ message: error.message });
  }
};
const getAll = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(statusCode.created).json({ data: products });
  } catch (error) {
    res.status(statusCode.badRequest).json({ message: error.message });
  }
};
const createCollection = async (req, res) => {
  try {
    let product;
    for (var i = 0; i < DB.length; i++) {
      const name = DB[i].name;
      const shipping = DB[i].shipping;
      const discount = DB[i].discount;
      const price = DB[i].price;
      for (var j = 0; j < 100; j++) {
        product = DB[i];

        const isEven = j % 2 == 0;
        product.shipping = isEven ? shipping : shipping + j;
        product.name = `${j} ${name}`;
        product.discount = isEven && j < 90 ? j : discount;
        product.price = price + j;
        await Product.create(product);
      }
    }
    res.status(statusCode.created).json({ message: "created" });
  } catch (error) {
    res.status(statusCode.badRequest).json({ message: error.message });
  }
};
module.exports = {
  create,
  getAllByCategoryId,
  getById,
  getByIds,
  getBySubCategoryId,
  getByFilter,
  getAll,
  createCollection,
};
