const express = require("express");
const {
  createproduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productCtrl");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/create", authMiddleware, isAdmin, createproduct);
router.get("/all-products", getProducts);
router.get("/:id", getProduct);
router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);

module.exports = router;
