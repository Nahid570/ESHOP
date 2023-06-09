const mongoose = require("mongoose");

const validatemongoId = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);

  if (!isValid) {
    throw new Error("Invalid User Id");
  }
};

module.exports = validatemongoId;
