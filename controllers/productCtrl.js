const Product = require("../models/Product");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const validatemongoId = require("../utils/validateMongoId");
const { cloudinaryUploadImage } = require("../utils/cloudinary");
const fs = require("fs");

exports.createproduct = asyncHandler(async (req, res) => {
  try {
    if (req?.body?.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req?.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const { id } = req?.params;
  validatemongoId(id);
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updateProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateProduct);
  } catch (error) {
    throw new Error(error);
  }
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req?.params;
  validatemongoId(id);
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.json(deletedProduct);
  } catch (error) {
    throw new Error(error);
  }
});

exports.getProducts = asyncHandler(async (req, res) => {
  try {
    // Filtering
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Product.find(JSON.parse(queryStr));

    // Sorting

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // limiting the fields

    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // pagination

    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) throw new Error("This Page does not exists");
    }
    const product = await query;
    res.json(product);
  } catch (error) {
    throw new Error(error);
  }
});

exports.getProduct = asyncHandler(async (req, res) => {
  const { id } = req?.params;
  validatemongoId(id);
  try {
    const singleProduct = await Product.findById(id);
    res.json(singleProduct);
  } catch (error) {
    throw new Error(error);
  }
});

exports.addToWishList = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { prodId } = req.body;
  try {
    const user = await User.findById(_id);
    const alreadyadded = user.wishlist.find((id) => id.toString() === prodId);
    if (alreadyadded) {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $pull: { wishlist: prodId },
        },
        {
          new: true,
        }
      );
      res.json(user);
    } else {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $push: { wishlist: prodId },
        },
        {
          new: true,
        }
      );
      res.json(user);
    }
  } catch (error) {
    throw new Error(error);
  }
});

exports.rating = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, prodId, comment } = req.body;
  try {
    const product = await Product.findById(prodId);
    let alreadyRated = product.ratings.find(
      (userId) => userId.postedby.toString() === _id.toString()
    );
    if (alreadyRated) {
      const updateRating = await Product.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: { "ratings.$.star": star, "ratings.$.comment": comment },
        },
        {
          new: true,
        }
      );
      res.json(updateRating);
    } else {
      const rateProduct = await Product.findByIdAndUpdate(
        prodId,
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedby: _id,
            },
          },
        },
        {
          new: true,
        }
      );
    }
    const getallratings = await Product.findById(prodId);
    let totalRating = getallratings.ratings.length;
    let ratingsum = getallratings.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
    let actualRating = Math.round(ratingsum / totalRating);
    let finalproduct = await Product.findByIdAndUpdate(
      prodId,
      {
        totalrating: actualRating,
      },
      { new: true }
    );
    res.json(finalproduct);
  } catch (error) {
    throw new Error(error);
  }
});

exports.uploadImages = asyncHandler(async (req, res) => {
  const { id } = req?.params;
  validatemongoId(id);
  try {
    const uploader = (path, folder) => cloudinaryUploadImage(path, folder);
    const urls = [];
    const files = req.files;
    console.log(files);
    for (let i = 0; i < files.length; i++) {
      const { path } = files[i];
      const newpath = await uploader(path, "Products");
      urls.push(newpath);
      fs.unlinkSync(path);
    }
    const findproduct = await Product.findByIdAndUpdate(
      id,
      {
        images: urls?.map((file) => {
          return file;
        }),
      },
      {
        new: true,
      }
    );
    res.json(findproduct);
  } catch (error) {
    throw new Error(error);
  }
});
