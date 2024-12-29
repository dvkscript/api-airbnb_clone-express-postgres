const passport = require("passport");
const resUtil = require("../../utils/res.util");
const AuthProvider = require("../../enums/authProvider");
const authService = require("../../services/auth.service");

module.exports = {
  signIn: (provider) => async (req, res, next) => {
    passport.authenticate(provider, async (err, user, info) => {
      resUtil.catchError(async (req, res, next) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          throw new resUtil.CatchError({
            status: info.status,
            message: info?.message,
          });
        }
        req.logIn(user, async (err) => {
          resUtil.catchError(async (req, res, next) => {
            if (err) {
              throw new resUtil.CatchError(err);
            }
            let data = null;
            switch (provider) {
              case AuthProvider.LOCAL_ADMIN:
                data = await authService.localAdmin(user.id, provider);
                break;
              case AuthProvider.LOCAL_USER:
                data = await authService.localUser(user.id, provider);
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
          })(req, res, next);
        });
      })(req, res, next);
    })(req, res, next);
  },
};
