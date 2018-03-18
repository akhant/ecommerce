const router = require("express").Router();
import passport from "passport";
import passportConf from "../config/passport";
import User from "../models/user";
import waterfall from "async/waterfall";
import Cart from '../models/cart'

//login
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

//logout
router.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/");
});

//edit-profile
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
      return res.redirect("/profile");
    });
  });
});

router.get("/profile", passportConf.isAuthenticated, (req, res, next) => {
  User
    .findOne({ _id: req.user._id })
    .populate('history.item')
    .exec((err, foundUser) => {
    if (err) return next(err);
    res.render("accounts/profile", { history: foundUser.history });
  });
});

//signup
router.get("/signup", (req, res) => {
  res.render("accounts/signup", {
    errors: req.flash("errors")
  });
});

router.post("/signup", (req, res, next) => {
  waterfall([
    cb => {
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
            cb(null, user);
          });
        }
      });
    },
    user => {
      const cart = new Cart();
      cart.owner = user._id;
      cart.save(err => {
        if (err) return next(err);
        req.logIn(user, err => {
          if (err) return next(err);
          res.redirect("/profile");
        });
      });
    }
  ]);
});


router.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}))

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
  seccussRedirect: '/profile',
  failureRoute: '/login'
}))
export default router;
