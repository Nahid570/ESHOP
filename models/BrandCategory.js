const mongoose = require("mongoose");

let brandCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("BRANDCATEGORY", brandCategorySchema);
