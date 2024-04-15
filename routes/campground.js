const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const catchAsync = require("../utils/catchAsync");
const { campgroundSchema } = require("../schemas");
const ExpressError = require("../utils/ExpressError");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");

// Index Page
router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

// Add new Campground Page
router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});
router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res) => {
    const newCampground = Campground(req.body);
    newCampground.user = req.user._id;
    await newCampground.save();
    req.flash("success", "Successfully made a new campground");
    res.redirect(`/campgrounds/${newCampground._id}`);
  })
);

// Details Page
router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
      .populate("reviews")
      .populate("user");
    if (!campground) {
      req.flash("error", "Cannot find that campground");
      res.redirect("/campgrounds");
    }
    res.render("campgrounds/details", { campground });
  })
);

// Edit Page
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      req.flash("error", "Campground doesn't exists");
      res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
  })
);
router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, {
      ...req.body,
    });
    if (!campground) {
      req.flash("error", "Cannot find that campground");
      res.redirect("/campgrounds");
    }
    req.flash("success", "Successfully updated campground");
    res.redirect(`/campgrounds/${req.params.id}`);
  })
);

// Delete Campground
router.delete("/:id", isLoggedIn, isAuthor, async (req, res) => {
  await Campground.findByIdAndDelete(req.params.id);
  req.flash("success", "Successfully deleted campground");
  res.redirect("/campgrounds");
});

module.exports = router;
