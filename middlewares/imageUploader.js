const sharp = require("sharp");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let destinationPath = path.join(__dirname, "../public/images");
    if (file.fieldname === "prodimages") {
      destinationPath = path.join(destinationPath, "products");
    } 
    else if (file.fieldname === "blogimage") {
      destinationPath = path.join(destinationPath, "blogs");
    }
    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".jpg");
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
  limits: 10 * 1024 * 1024,
});

// not working, I've to fix that
const productImgResize = async (req, res, next) => {
  if (!req.files) return next();
  await Promise.all(
    req.files.map(async (file) => {
      await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpg")
        .jpeg({ quality: 90 });
      //   .toFile(`public/images/products/${file.filename}`);
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
        .toFormat("jpg")
        .jpeg({ quality: 90 });
      //   .toFile(`public/images/products/${file.filename}`);
      // fs.unlinkSync(file.path);
    })
  );
  next();
};

module.exports = { uploadPhoto, productImgResize, blogImgResize };
