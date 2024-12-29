const AuthProvider = require("../../enums/authProvider");
const userTokenService = require("../../services/userToken.service");
const jwtUtil = require("../../utils/jwt.util");
const resUtil = require("../../utils/res.util");
const authValidator = require("../../validators/auth.validator");

module.exports = (provider) =>
    resUtil.catchError(async (req, res, next) => {
      const body = await req.validate(req.body, authValidator.refreshToken);
  
      const refreshToken = body.refresh_token;
  
      let decodeToken;
      let createAccessToken;
      switch (provider) {
        case AuthProvider.USER_REFRESH_TOKEN:
          decodeToken = jwtUtil.user.decodeToken;
          createAccessToken = jwtUtil.user.createAccessToken;
          break;
        case AuthProvider.ADMIN_REFRESH_TOKEN:
          decodeToken = jwtUtil.admin.decodeToken;
          createAccessToken = jwtUtil.admin.createAccessToken;
          break;
        default:
          throw new resUtil.CatchError({
            status: 500,
            message: "Server error",
          });
      }
  
      decodeToken(refreshToken);
  
      const userToken = await userTokenService.getUserToken(refreshToken);
      if (!userToken) {
        throw new resUtil.CatchError({
          status: 404,
          message: "Token not found",
        });
      }
  
      return resUtil.success(res, {
        status: 200,
        message: "success",
        data: {
          accessToken: createAccessToken({
            userId: userToken.user_id,
          }),
          refreshToken,
        },
      });
    });
  