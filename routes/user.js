const router = require("express").Router();
import User from "../models/user";

router.get("/signup", (req, res) => {
  res.render("accounts/signup", {
    errors: req.flash('errors')
  });
});

router.post("/signup", (req, res, next) => {
  let user = new User();
  user.profile.name = req.body.name;
  user.password = req.body.password;
  user.email = req.body.email;

  User.findOne({ email: req.body.email }, (err, existingUser) => {
    if (existingUser) {
      req.flash('errors', "Account already exist")
      return res.redirect("/signup");
    } else {
      user.save((err, user) => {
        console.log("user saved")
        if (err) return next(err);
        console.log("without errors")
        res.redirect('/')
      });
    }
  });
});

export default router;
