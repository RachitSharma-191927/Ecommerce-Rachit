const { isObjectIdOrHexString } = require("mongoose");
var GoogleStrategy = require("passport-google-oauth20");
var LocalStrategy = require("passport-local");
const register = require("../Models/register");

module.exports = function (passport) {
  passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
      cb(null, user);
    });
  });

  passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
      return cb(null, user);
    });
  });

  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true, // allows us to pass back the entire request to the callback
      },
      function (req, email, password, done) {
        process.nextTick(function () {
          register.findOne({ email: email }, function (err, user) {
            if (err) return done(err);
            if (user) {
              return done(null, false,req.flash("failure", "Your account is already present"));
            } else {
              var newUser = new register();
              newUser.email = email;
              newUser.password = newUser.generateHash(password);
              (newUser.name = req.body.name),
                (newUser.img = "/Images/AccountImage.png"),
                (newUser.username = email.split("@")[0]),
                newUser.save(function (err) {
                  if (err) throw err;
                  return done(null, newUser);
                });
            }
          });
        });
      }
    )
  );

  passport.use(
    "local-login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      function (req, email, password, done) {
        register.findOne({ email: email }, function (err, user) {
          if (err) return done(err);
          if (!user)
            return done(null, false, req.flash("failure", "Incorrect Email or Password"));

          if (!user.validPassword(req.body.password))
            return done(
              null,
              false,
              req.flash("failure", "Oops! Wrong password.")
            );
          return done(null, user);
        });
      }
    )
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env["GOOGLE_CLIENT_ID"],
        clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
        callbackURL: "https://ecommerce-rachit.vercel.app/oauth2/redirect/google",
        scope: [],
      },
      function verify(accessToken, refreshToken, profile, cb) {
        register.findOne(
          {
            email: profile.emails[0].value,
          },
          (err, dat) => {
            if (err) {
              return cb(err);
            }
            if (!dat) {
              const account = new register({
                name: profile.displayName,
                email: profile.emails[0].value,
                img: profile.photos[0].value,
                username: profile.emails[0].value.split("@")[0],
              });
              account
                .save()
                .then((a) => {
                  return cb(null, a);
                })
                .catch((e) => {
                  return cb(err);
                });
            } else {
              return cb(null, dat);
            }
          }
        );
      }
    )
  );
};
