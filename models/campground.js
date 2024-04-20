const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});
const opts = { toJSON: { virtuals: true } };
const CampgroundSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: String,
    images: [ImageSchema],
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    price: Number,
    description: String,
    location: String,
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  },
  opts
);
CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
  return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
  <p>${this.description.substring(0, 35)}...</p>`;
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
