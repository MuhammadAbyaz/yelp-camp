const express = require("express");
const mongoose = require("mongoose");
const Campground = require("./models/campground");
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
// Home Page
app.get("/", (req, res) => {
  res.render("home");
});

// Index Page
app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

// Add new Campground Page
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.post("/campgrounds", async (req, res) => {
  const newCampground = Campground(req.body);
  await newCampground.save();
  res.redirect(`/campgrounds/${newCampground._id}`);
});

// Details Page
app.get("/campgrounds/:id", async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/details", { campground });
});

// Edit Page
app.get("/campgrounds/:id/edit", async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/edit", { campground });
});
app.put("/campgrounds/:id", async (req, res) => {
  await Campground.findByIdAndUpdate(req.params.id, { ...req.body });
  res.redirect(`/campgrounds/${req.params.id}`);
});

// Delete Campground
app.delete("/campgrounds/:id", async (req, res) => {
  await Campground.findByIdAndDelete(req.params.id);
  res.redirect("/campgrounds");
});
// Starting the server to listen to any request
app.listen(3000, () => {
  console.log("LISTENING ON PORT 3000!!");
});
