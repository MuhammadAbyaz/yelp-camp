const mongoose = require("mongoose");
const reviewSchema = mongoose.Schema({
  body: String,
  rating: Number,
});
module.exports = mongoose.model("Review", reviewSchema);
