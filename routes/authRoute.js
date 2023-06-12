const express = require("express");
const {
  createUser,
  loginUser,
  getUsers,
  getUser,
  deleteUser,
  updateUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  getWishlist,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getOrders,
  updateOrderStatus,
} = require("../controllers/userCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/allUsers", getUsers);
router.get("/refresh-token", handleRefreshToken);
router.get("/logout", logout);
router.post("/forget-pass", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);

router.get("/get-order", authMiddleware, getOrders);
router.get("/get-wishlists", authMiddleware, getWishlist);
router.post("/cart-apply-coupon", authMiddleware, applyCoupon);
router.post("/cart", authMiddleware, userCart);
router.get("/cart", authMiddleware, getUserCart);
router.delete("/empty-cart", authMiddleware, emptyCart);
router.post("/cart/create-order", authMiddleware, createOrder);
router.put("/update-pass", authMiddleware, updatePassword);

router.put("/update-order/:id", authMiddleware, isAdmin, updateOrderStatus);
router.get("/:id", authMiddleware, isAdmin, getUser);
router.put("/edit-profile", authMiddleware, updateUser);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);
router.delete("/:id", deleteUser);

module.exports = router;
