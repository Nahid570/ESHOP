const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {
  createBlog,
  updateBlog,
  getBlogPost,
  getAllBlogPosts,
  deleteBlogPost,
  likeTheBlogPost,
  dislikeTheBlogPost,
} = require("../controllers/blogCtrl");
const router = express.Router();

router.get("/all-blogs", getAllBlogPosts);
router.get("/:id", getBlogPost);

router.put("/like", authMiddleware, likeTheBlogPost);
router.put("/dislike", authMiddleware, dislikeTheBlogPost);

router.post("/create", authMiddleware, isAdmin, createBlog);
router.put("/:id", authMiddleware, isAdmin, updateBlog);
router.delete("/:id", authMiddleware, isAdmin, deleteBlogPost);

module.exports = router;
