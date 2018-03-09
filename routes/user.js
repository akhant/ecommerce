const router = require("express").Router();
import passport from "passport";
import passportConf from "../config/passport";
import User from "../models/user";

router.get("/login", (req, res) => {
  if (req.user) return res.redirect("/");
  res.render("accounts/login", { message: req.flash("loginMessage") });
});

router.post(
  "/login",
  passport.authenticate("local-login", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true
  })
);

router.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/");
});

router.get("/edit-profile", (req, res, next) => {
  res.render("accounts/edit-profile", { message: req.flash("success") });
});

router.post("/edit-profile", (req, res, next) => {
  User.findOne({ _id: req.user._id }, (err, user) => {
    if (err) return next(err);
    if (req.body.name) user.profile.name = req.body.name;
    if (req.body.address) user.address = req.body.address;
    user.save(err => {
      if (err) return next(err);
      req.flash("success", "successfilly editing your profile");
      return res.redirect("/edit-profile");
    });
  });
});

router.get("/profile", (req, res, next) => {
  User.findOne({ _id: req.user._id }, (err, user) => {
    if (err) return next(err);
    res.render("accounts/profile", { user: user });
  });
});

router.get("/signup", (req, res) => {
  res.render("accounts/signup", {
    errors: req.flash("errors")
  });
});

router.post("/signup", (req, res, next) => {
  let user = new User();
  user.profile.name = req.body.name;
  user.password = req.body.password;
  user.email = req.body.email;
  user.profile.picture = user.gravatar();

  User.findOne({ email: req.body.email }, (err, existingUser) => {
    if (existingUser) {
      req.flash("errors", "Account already exist");
      return res.redirect("/signup");
    } else {
      user.save((err, user) => {
        if (err) return next(err);

        req.logIn(user, err => {
          if (err) return next(err);
          res.redirect("/profile");
        });
      });
    }
  });
});

export default router;
