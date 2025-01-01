const FacebookStrategy = require("passport-facebook").Strategy;
require("dotenv").config();

module.exports = new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${process.env.HOSTING_USER}/auth/google/callback`,
    scope: ["email", "profile"],
    passReqToCallback: true,
  },
  function (request, accessToken, refreshToken, profile, done) {
    console.log(profile,4444444444);
    
    const user = {
      full_name: profile?.displayName,
      email: profile?.email,
      thumbnail: profile?._json?.picture,
      provider: profile?.provider,
    };
    done(null, user);
  }
);
