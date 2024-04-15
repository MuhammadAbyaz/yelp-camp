const campgroundModel = require("../models/campground");

class CampgroundController {
  constructor(campgroundModel) {
    this.campgroundModel = campgroundModel;
  }
  async showAllCampgrounds(req, res) {
    const campgrounds = await this.campgroundModel.find({});
    res.render("campgrounds/index", { campgrounds });
  }
  async addNewCampground(req, res) {
    const newCampground = this.campgroundModel(req.body);
    newCampground.user = req.user._id;
    await newCampground.save();
    res.redirect(`campgrounds/${newCampground._id}`);
  }
  async showCampgroundById(req, res) {
    const campground = await this.campgroundModel
      .findById(req.params.id)
      .populate({
        path: "reviews",
        populate: {
          path: "user",
        },
      })
      .populate("user");
    if (!campground) {
      req.flash("error", "Cannot find that campground");
      res.redirect("/campgrounds");
    }
    res.render("campgrounds/details", { campground });
  }
  async updateCampground(req, res) {
    const campground = await this.campgroundModel.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
      }
    );
    if (!campground) {
      req.flash("error", "Campground doesn't exists");
      res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
  }
  async deleteCampground(req, res) {
    const campground = await Campground.findByIdAndDelete(req.params.id);
    if (!campground) {
      req.flash("error", "No such campground exists");
      return res.redirect("/campgrounds");
    }
    req.flash("success", "Successfully deleted campground");
    res.redirect("/campgrounds");
  }
}
module.exports.campgroundController = new CampgroundController(campgroundModel);
