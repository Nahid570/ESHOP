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

router.put("/update-pass", authMiddleware, updatePassword);
router.get("/:id", authMiddleware, isAdmin, getUser);
router.put("/edit-profile", authMiddleware, updateUser);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);
router.delete("/:id", deleteUser);

module.exports = router;
