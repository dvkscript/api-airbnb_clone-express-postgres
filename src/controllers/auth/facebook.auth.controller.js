const { ServerResponse } = require("http");
const passport = require("passport");
const resUtil = require("../../utils/res.util");
const authValidator = require("../../validators/auth.validator");
const authService = require("../../services/auth.service");
const AuthProvider = require("../../enums/authProvider");

module.exports = {
  get: (provider) =>
    resUtil.catchError(async (req, res, next) => {
      const emptyResponse = new ServerResponse(req);
      
      passport.authenticate(provider, {
        scope: ["email", "profile"],
      })(req, emptyResponse);

      const url = emptyResponse.getHeader("location");

      if (!url) {
        throw new resUtil.CatchError({
          status: 500,
          message: "Internal server error",
        });
      }

      return resUtil.success(res, {
        status: 200,
        message: "success",
        data: {
          urlRedirect: url,
        },
      });
    }),
  callback: (provider) =>
    resUtil.catchError(async (req, res, next) => {
      const body = await req.validate(
        {
          ...req.user,
          provider,
        },
        authValidator.social
      );

      let data = null;

      switch (provider) {
        case AuthProvider.FACEBOOK_USER:
          data = await authService.socialUser(body);
          break;

        default:
          throw new resUtil.CatchError({
            status: 500,
            message: "Provider invalid",
          });
      }

      return resUtil.success(res, {
        status: 200,
        message: "success",
        data,
      });
    }),
};
