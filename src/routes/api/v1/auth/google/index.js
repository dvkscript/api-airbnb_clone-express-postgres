var express = require("express");
const googleAuthController = require("../../../../../controllers/auth/google.auth.controller");
const AuthProvider = require("../../../../../enums/authProvider");
const passport = require("passport");
const methodMiddleware = require("../../../../../middlewares/method.middleware");
var router = express.Router();

const provider = AuthProvider.GOOGLE_USER;

router.use("/google", methodMiddleware("GET"));
router.get("/google", googleAuthController.get(provider));

router.use("/google/callback", methodMiddleware("GET"));
router.get(
  "/google/callback",
  passport.authenticate(provider, {
    session: false,
  }),
  googleAuthController.callback(provider)
);

module.exports = router;
