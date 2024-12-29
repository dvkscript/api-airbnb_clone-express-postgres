var express = require("express");
const passport = require("passport");
const AuthProvider = require("../../../../../../enums/authProvider");
const githubAuthController = require("../../../../../../controllers/auth/github.auth.controller");
var router = express.Router();

const provider = AuthProvider.GITHUB_ADMIN;

router.get("/github", githubAuthController.get(provider));
router.get(
  "/github/callback",
  passport.authenticate(provider, {
    session: false,
  }),
  githubAuthController.callback(provider)
);

module.exports = router;
