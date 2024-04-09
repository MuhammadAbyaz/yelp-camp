const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const { campgroundSchema } = require("./schemas");
const Campground = require("./models/campground");
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
    console.log(msg);
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

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
    const campground = await Campground.findById(req.params.id);
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
