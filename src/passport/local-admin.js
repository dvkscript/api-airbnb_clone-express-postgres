const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const authValidator = require("../validators/auth.validator");
const userService = require("../services/user.service");
const Permission = require("../enums/permission");

module.exports = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true,
  },
  async (req, email, password, done) => {
    await req.validate(
      {
        email,
        password,
      },
      authValidator.local
    );
    const user = await userService.getUserProfile(
      {
        email,
      },
      {
        attributes: {},
      }
    );
    if (!user) {
      return done(null, false, {
        status: 404,
        message: "User not found",
      });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return done(null, false, {
        status: 400,
        message: "Password incorrect",
      });
    }
    const permissions = user.permissions;
    if (!permissions?.includes(Permission.ADMIN_ACCESS)) {
      return done(null, false, {
        status: 403,
        message: "Forbidden",
      });
    }
    return done(null, user);
  }
);
