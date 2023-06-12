const express = require("express");
const {
  createproduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  addToWishList,
  rating,
  uploadImages,
  deleteImages,
} = require("../controllers/productCtrl");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const {
  uploadPhoto,
  productImgResize,
} = require("../middlewares/imageUploader");
const router = express.Router();

// image upload
router.put(
  "/upload",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("prodimages", 5),
  productImgResize,
  uploadImages
);
router.post("/create", authMiddleware, isAdmin, createproduct);
router.get("/all-products", getProducts);
router.get("/:id", getProduct);
router.put("/wishlist", authMiddleware, addToWishList);
router.put("/rating", authMiddleware, rating);

router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);
router.delete("/deleted-img/:id", authMiddleware, isAdmin, deleteImages);

module.exports = router;
