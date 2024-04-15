const reviewModel = require("../models/review");
const campgroundModel = require("../models/campground");
class Review {
  constructor(reviewModel, campgroundModel) {
    this.reviewModel = reviewModel;
    this.campgroundModel = campgroundModel;
  }
  async showAllReviews(req, res) {
    const campground = await this.campgroundModel.findById(req.params.id);
    const review = this.reviewModel(req.body);
    review.user = req.user.id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Created new review");
    res.redirect(`/campgrounds/${campground._id}`);
  }
  async deleteReview(req, res) {
    const { id, reviewId } = req.params;
    await this.campgroundModel.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });
    await this.reviewModel.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted review");
    res.redirect(`/campgrounds/${id}`);
  }
}

module.exports.reviewController = new Review(reviewModel, campgroundModel);
