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
    newCampground.images = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    }));
    newCampground.user = req.user._id;
    console.log(newCampground);
    await newCampground.save();
    res.redirect(`campgrounds/${newCampground._id}`);
  }
  async renderEditForm(req, res) {
    const { id } = req.params;
    const campground = await this.campgroundModel.findById(id);
    res.render("campgrounds/edit", { campground });
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
    const imgs = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    }));
    campground.images.push(...imgs);
    await campground.save();
    res.redirect(`campgrounds/${req.params.id}`, { campground });
  }
  async deleteCampground(req, res) {
    const campground = await this.campgroundModel.findByIdAndDelete(
      req.params.id
    );
    if (!campground) {
      req.flash("error", "No such campground exists");
      return res.redirect("/campgrounds");
    }
    req.flash("success", "Successfully deleted campground");
    res.redirect("/campgrounds");
  }
}
module.exports.campgroundController = new CampgroundController(campgroundModel);
