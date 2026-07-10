const Category = require("../models/category.model");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");


// GET ALL
exports.getCategories = asyncHandler(async (req, res) => {

  const categories = await Category.find();

  res.json({
    status: "success",
    message: "Categories fetched successfully",
    data: categories
  });

});


// GET ONE
exports.getCategory = asyncHandler(async (req, res, next) => {

  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  res.json({
    status: "success",
    message: "Category fetched successfully",
    data: category
  });

});


// CREATE
exports.createCategory = asyncHandler(async (req, res) => {

  const category = await Category.create(req.body);

  res.status(201).json({
    status: "success",
    message: "Category created successfully",
    data: category
  });

});


// UPDATE
exports.updateCategory = asyncHandler(async (req, res, next) => {

  const category = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!category) {
    return next(new AppError("Category not found", 404));
  }


  res.json({
    status: "success",
    message: "Category updated successfully",
    data: category
  });

});


// DELETE
exports.deleteCategory = asyncHandler(async (req, res, next) => {

  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    return next(new AppError("Category not found", 404));
  }


  res.json({
    status: "success",
    message: "Category deleted successfully",
    data: null
  });

});