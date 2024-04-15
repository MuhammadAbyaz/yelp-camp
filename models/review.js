const mongoose = require("mongoose");
const reviewSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  body: String,
  rating: Number,
});
module.exports = mongoose.model("Review", reviewSchema);
