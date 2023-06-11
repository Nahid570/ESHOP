const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  individualCoupon,
} = require("../controllers/couponCtrl");
const router = express.Router();

router.post("/create", authMiddleware, isAdmin, createCoupon);
router.get("/all-coupon", authMiddleware, isAdmin, getAllCoupons);
router.get("/:id", authMiddleware, isAdmin, individualCoupon);
router.put("/:id", authMiddleware, isAdmin, updateCoupon);
router.delete("/:id", authMiddleware, isAdmin, deleteCoupon);

module.exports = router;
