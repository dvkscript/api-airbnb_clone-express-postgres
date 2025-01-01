const passport = require("passport");
const { User } = require("../models");
const googleUserPassport = require("./google-user");
const githubUserPassport = require("./github-user");
const googleAdminPassport = require("./google-admin");
const githubAdminPassport = require("./github-admin");
const facebookUserPassport = require("./facebook-user");
const AuthProvider = require("../enums/authProvider");
const localUser = require("./local-user");
const localAdmin = require("./local-admin");

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(async function (user, done) {
  const data = await User.findOne({
    where: {
      email: user.email,
    },
  });
  done(null, data);
});

passport.use(AuthProvider.LOCAL_USER, localUser);
passport.use(AuthProvider.LOCAL_ADMIN, localAdmin);
passport.use(AuthProvider.GOOGLE_USER, googleUserPassport);
passport.use(AuthProvider.GITHUB_USER, githubUserPassport);
passport.use(AuthProvider.GOOGLE_ADMIN, googleAdminPassport);
passport.use(AuthProvider.GITHUB_ADMIN, githubAdminPassport);
passport.use(AuthProvider.FACEBOOK_USER, facebookUserPassport);

module.exports = passport;
