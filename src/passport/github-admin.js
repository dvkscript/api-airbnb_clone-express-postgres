const GithubStrategy = require("passport-github2").Strategy;
require("dotenv").config();

module.exports = new GithubStrategy(
  {
    clientID: process.env.GITHUB_ADMIN_CLIENT_ID,
    clientSecret: process.env.GITHUB_ADMIN_SECRET,
    callbackURL: `${process.env.HOSTING_ADMIN}/auth/github/callback`,
    scope: ["user:email", "profile"],
    passReqToCallback: true,
  },
  function (request, accessToken, refreshToken, profile, done) {
    const user = {
      full_name: profile?.displayName,
      email: profile?.emails[0].value,
      thumbnail: profile?.photos[0]?.value,
      provider: profile?.provider,
    };
    done(null, user);
  }
);
