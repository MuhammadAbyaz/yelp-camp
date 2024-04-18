const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const CampgroundSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: String,
  images: [
    {
      url: String,
      filename: String,
    },
  ],
  price: Number,
  description: String,
  location: String,
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
});
CampgroundSchema.post("findOneAndDelete", async function (camp) {
  if (camp.reviews) {
    await Review.deleteMany({
      _id: {
        $in: camp.reviews,
      },
    });
  }
});
module.exports = mongoose.model("Campground", CampgroundSchema);
