const sharp = require("sharp");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(file);
    let destinationPath = path.join(__dirname, "../public/images");
    if (file.fieldname === "images") {
      destinationPath = path.join(destinationPath, "products");
    } else if (file.fieldname === "blogimage") {
      destinationPath = path.join(destinationPath, "blogs");
    }
    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".jpeg");
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb({ message: "Unsupported file format" }, false);
  }
};

const uploadPhoto = multer({
  storage,
  fileFilter: multerFilter,
  limits: 5000,
});

// not working, I've to fix that
const productImgResize = async (req, res, next) => {
  if (!req.files) return next();
  await Promise.all(
    req.files.map(async (file) => {
      await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 });
      // .toFile(path.join(`public/images/products/${file.fieldname}`));
      // fs.unlinkSync(file.path);
    })
  );
  next();
};

const blogImgResize = async (req, res, next) => {
  if (!req.files) return next();
  await Promise.all(
    req.files.map(async (file) => {
      await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 });
      //   .toFile(`public/images/products/${file.filename}`);
      // fs.unlinkSync(file.path);
    })
  );
  next();
};

module.exports = { uploadPhoto, productImgResize, blogImgResize };
