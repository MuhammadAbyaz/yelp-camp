const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const { campgroundController } = require("../controllers/campground");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({
  storage,
});

// Index Page
router
  .route("/")
  .get(
    catchAsync(
      campgroundController.showAllCampgrounds.bind(campgroundController)
    )
  )
  .post(
    isLoggedIn,
    upload.array("images"),
    validateCampground,
    catchAsync(campgroundController.addNewCampground.bind(campgroundController))
  );

// Add new Campground Page
router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

// Edit Page
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgroundController.renderEditForm.bind(campgroundController))
);
router
  .route("/:id")
  .get(
    catchAsync(
      campgroundController.showCampgroundById.bind(campgroundController)
    )
  )
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("images"),
    validateCampground,
    catchAsync(campgroundController.updateCampground.bind(campgroundController))
  )
  .delete(
    isLoggedIn,
    isAuthor,
    catchAsync(campgroundController.deleteCampground.bind(campgroundController))
  );

module.exports = router;
