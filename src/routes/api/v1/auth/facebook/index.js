var express = require("express");
const AuthProvider = require("../../../../../enums/authProvider");
const passport = require("passport");
const methodMiddleware = require("../../../../../middlewares/method.middleware");
const facebookAuthController = require("../../../../../controllers/auth/facebook.auth.controller");
var router = express.Router();

const provider = AuthProvider.FACEBOOK_USER;

router.use("/facebook", methodMiddleware("GET"));
router.get("/facebook", facebookAuthController.get(provider));

router.use("/facebook/callback", methodMiddleware("GET"));
router.get(
  "/facebook/callback",
  passport.authenticate(provider, {
    session: false,
  }),
  facebookAuthController.callback(provider)
);

module.exports = router;
