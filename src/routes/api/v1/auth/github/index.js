var express = require("express");
const AuthProvider = require("../../../../../enums/authProvider");
const passport = require("passport");
const githubAuthController = require("../../../../../controllers/auth/github.auth.controller");
const methodMiddleware = require("../../../../../middlewares/method.middleware");
var router = express.Router();

const provider = AuthProvider.GITHUB_USER;


router.use("/github", methodMiddleware("GET"));
router.get("/github", githubAuthController.get(provider));

router.use("/github/callback", methodMiddleware("GET"));
router.get(
  "/github/callback",
  passport.authenticate(provider, {
    session: false,
  }),
  githubAuthController.callback(provider)
);

module.exports = router;
