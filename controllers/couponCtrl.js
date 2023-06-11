const Coupon = require("../models/Coupon");
const asyncHandler = require("express-async-handler");
const validatemongoId = require("../utils/validateMongoId");

exports.createCoupon = asyncHandler(async (req, res) => {
  try {
    const newCoupon = await Coupon.create(req?.body);
    res.json(newCoupon);
  } catch (error) {
    throw new Error(error);
  }
});

exports.getAllCoupons = asyncHandler(async (req, res) => {
    console.log("Hello User");
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (error) {
    throw new Error(error);
  }
});

exports.updateCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validatemongoId(id);
  try {
    const updatecoupon = await Coupon.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatecoupon);
  } catch (error) {
    throw new Error(error);
  }
});

exports.deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validatemongoId(id);
  try {
    const deletecoupon = await Coupon.findByIdAndDelete(id);
    res.json(deletecoupon);
  } catch (error) {
    throw new Error(error);
  }
});

exports.individualCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validatemongoId(id);
  try {
    const getAcoupon = await Coupon.findById(id);
    res.json(getAcoupon);
  } catch (error) {
    throw new Error(error);
  }
});
