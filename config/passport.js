import passport from "passport";
import User from "../models/user";

const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
import secret from "./secret";

//serialize and deserialize
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

//passpory login middleware
passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true
    },
    function(req, email, password, done) {
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

//facebook middleware
passport.use(
  new FacebookStrategy(
    secret.facebook,
    (token, refreshToken, profile, done) => {
      User.findOne({ facebook: profile.id }, (err, user) => {
        if (err) return done(err);
        if (user) {
          return done(null, user);
        } else {
          waterfall([
            cb => {
              const newUser = new User();
              newUser.email = profile._json.email;
              newUser.facebook = profile.id;
              newUser.tokens.push({ kind: "facebook", token: token });
              newUser.profile.name = profile.displayName;
              newUser.profile.picture =
                "https://graph.facebook.com" +
                profile.id +
                "/picture?type=large";

              newUser.save(err => {
                if (err) {
                  throw err;
                }
                return done(null, newUser);
              });
            },
            newUser => {
              const cart = new Cart();
              cart.owner = newUser._id;
              cart.save(err => {
                if (err) return done(err);
                return done(err, newUser);
              });
            }
          ]);
        }
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
