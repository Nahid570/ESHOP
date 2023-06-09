const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;

  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decode = await jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decode?.id);
        req.user = user;
        next();
      }
    } catch (error) {
      throw new Error("Not authorized or Token expired");
    }
  } else {
    throw new Error("No token attatched to the header");
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  if (req?.user?.role === "admin") {
    next();
  } else {
    throw new Error("You are not an Admin");
  }
});

module.exports = {
  authMiddleware,
  isAdmin,
};
