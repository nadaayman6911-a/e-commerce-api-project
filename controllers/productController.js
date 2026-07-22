const Product = require("../models/product.model");
const Category = require("../models/category.model");

const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");


// GET ALL PRODUCTS
exports.getProducts = asyncHandler(async (req, res) => {
  const {
    category,
    minPrice,
    maxPrice,
    inStock,
    search,
  } = req.query;

  const filter = {};

  if (category) {
    filter.category = category;
  }

  if (minPrice || maxPrice) {
    filter.price = {};

    if (minPrice) {
      filter.price.$gte = Number(minPrice);
    }

    if (maxPrice) {
      filter.price.$lte = Number(maxPrice);
    }
  }

  if (inStock !== undefined) {
    filter.stock = inStock === "true"
      ? { $gt: 0 }
      : { $lte: 0 };
  }
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const products = await Product.find(filter);

  res.status(200).json({
    status: "success",
    message: "Products fetched successfully",
    data: products,
  });
});


// GET SINGLE PRODUCT
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
    .populate("category", "name description");

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Product fetched successfully",
    data: product,
  });
});


// CREATE PRODUCT
exports.createProduct = asyncHandler(async (req, res, next) => {

  const category = await Category.findById(req.body.category);

  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  const product = await Product.create(req.body);

  res.status(201).json({
    status: "success",
    message: "Product created successfully",
    data: product,
  });
});


// UPDATE PRODUCT
exports.updateProduct = asyncHandler(async (req, res, next) => {

  if (req.body.category) {

    const category = await Category.findById(req.body.category);

    if (!category) {
      return next(new AppError("Category not found", 404));
    }
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Product updated successfully",
    data: product,
  });
});


// DELETE PRODUCT
exports.deleteProduct = asyncHandler(async (req, res, next) => {

  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Product deleted successfully",
    data: null,
  });
});