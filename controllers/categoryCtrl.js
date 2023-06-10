const Category = require("../models/Category");
const asyncHandler = require("express-async-handler");
const validatemongoId = require("../utils/validateMongoId");

exports.createCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.create(req?.body);
    res.json(category);
  } catch (error) {
    throw new Error(error);
  }
});

exports.updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validatemongoId(id);
  try {
    const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedCategory);
  } catch (error) {
    throw new Error(error);
  }
});

exports.deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validatemongoId(id);
  try {
    const deletedCategory = await Category.findByIdAndDelete(id);
    res.json(deletedCategory);
  } catch (error) {
    throw new Error(error);
  }
});

exports.getCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validatemongoId(id);
  try {
    const getCategory = await Category.findById(id);
    res.json(getCategory);
  } catch (error) {
    throw new Error(error);
  }
});

exports.getallCategory = asyncHandler(async (req, res) => {
    console.log("hello");
  try {
    const getallCategory = await Category.find();
    res.json(getallCategory);
  } catch (error) {
    throw new Error(error);
  }
});
