const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const { campgroundSchema, reviewSchema } = require("./schemas");
const Campground = require("./models/campground");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");
const catchAsync = require("./utils/catchAsync");
const path = require("path");
const app = express();
const methodOverride = require("method-override");

mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error"));
db.once("open", () => {
  console.log("Database Connected");
});
// Setting up middlewares
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// Campground Routes
// Home Page
app.get("/", (req, res) => {
  res.render("home");
});

// Index Page
app.get(
  "/campgrounds",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

// Add new Campground Page
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});
app.post(
  "/campgrounds",
  validateCampground,
  catchAsync(async (req, res) => {
    const newCampground = Campground(req.body);
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`);
  })
);

// Details Page
app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate(
      "reviews"
    );
    res.render("campgrounds/details", { campground });
  })
);

// Edit Page
app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  })
);
app.put(
  "/campgrounds/:id",
  validateCampground,
  catchAsync(async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, {
      ...req.body,
    });
    res.redirect(`/campgrounds/${req.params.id}`);
  })
);

// Delete Campground
app.delete("/campgrounds/:id", async (req, res) => {
  await Campground.findByIdAndDelete(req.params.id);
  res.redirect("/campgrounds");
});

app.post(
  "/campgrounds/:id/reviews",
  validateReview,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);
app.delete(
  "/campgrounds/:id/reviews/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
  })
);
// For wrong url
app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

// Error Handler
app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(status).render("error", { err });
});

// Starting the server to listen to any request
app.listen(3000, () => {
  console.log("LISTENING ON PORT 3000!!");
});
