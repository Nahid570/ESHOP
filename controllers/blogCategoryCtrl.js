const BLOGCATEGORY = require("../models/BlogCategory");
const asyncHandler = require("express-async-handler");
const validatemongoId = require("../utils/validateMongoId");

exports.createCategory = asyncHandler(async (req, res) => {
  try {
    const category = await BLOGCATEGORY.create(req?.body);
    res.json(category);
  } catch (error) {
    throw new Error(error);
  }
});

exports.updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validatemongoId(id);
  try {
    const updatedCategory = await BLOGCATEGORY.findByIdAndUpdate(id, req.body, {
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
    const deletedCategory = await BLOGCATEGORY.findByIdAndDelete(id);
    res.json(deletedCategory);
  } catch (error) {
    throw new Error(error);
  }
});

exports.getCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validatemongoId(id);
  try {
    const getCategory = await BLOGCATEGORY.findById(id);
    res.json(getCategory);
  } catch (error) {
    throw new Error(error);
  }
});

exports.getallCategory = asyncHandler(async (req, res) => {
  console.log("hello");
  try {
    const getallCategory = await BLOGCATEGORY.find();
    res.json(getallCategory);
  } catch (error) {
    throw new Error(error);
  }
});
