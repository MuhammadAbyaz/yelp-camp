const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const passport = require("passport");
const { storeReturnTo } = require("../middleware");

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  storeReturnTo,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome Back!!");
    const redirectUrl = res.locals.returnTo || "/campgrounds";
    res.redirect(redirectUrl);
  }
);

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post(
  "/register",
  catchAsync(async (req, res) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({
        email,
        username,
      });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, (err) => {
        if (err) return next();
      });
      req.flash("success", "Welcome to Yelp Camp!");
      res.redirect("/campgrounds");
    } catch (e) {
      req.flash("error", e.msg);
      res.redirect("/register");
    }
  })
);
router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds");
  });
});

module.exports = router;
