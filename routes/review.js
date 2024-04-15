const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const { reviewController } = require("../controllers/review");
const { validateReview, isLoggedIn, isReviewOwner } = require("../middleware");

router.post(
  "/",
  isLoggedIn,
  validateReview,
  catchAsync(reviewController.showAllReviews.bind(reviewController))
);
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewOwner,
  catchAsync(reviewController.deleteReview.bind(reviewController))
);
module.exports = router;
