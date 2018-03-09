import passport from "passport";
import User from "../models/user";

const LocalStrategy = require("passport-local").Strategy;

//serialize and deserialize
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

//middleware
passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true
    },
    function(req, email, password, done){
      User.findOne({ email: email }, function(err, user) {
        if (err) return done(err);

        if (!user) {
          return done(
            null,
            false,
            req.flash("loginMessage", "No user has been found")
          );
        }

        if (!user.comparePassword(password)) {
          return done(null, false, req.flash("loginMessage", "Wrong password"));
        }

        return done(null, user);
      });
    }
  )
);

//custom function to validate
exports.isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};
