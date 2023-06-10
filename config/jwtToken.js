const jwt = require("jsonwebtoken");

const generateJWT_Token = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

module.exports = generateJWT_Token;
