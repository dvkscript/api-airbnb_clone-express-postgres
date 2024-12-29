var express = require("express");
const googleAuthController = require("../../../../../../controllers/auth/google.auth.controller");
const AuthProvider = require("../../../../../../enums/authProvider");
const passport = require("passport");
var router = express.Router();

const provider = AuthProvider.GOOGLE_ADMIN;

router.get("/google", googleAuthController.get(provider));
router.get(
  "/google/callback",
  passport.authenticate(provider, {
    session: false,
  }),
  googleAuthController.callback(provider)
);

module.exports = router;
