const resUtil = require("../utils/res.util");
const blacklistService = require("../services/blacklist.service");
const jwtUtil = require("../utils/jwt.util");
const userService = require("../services/user.service");

module.exports = {
  // user: resUtil.catchError(async (req, res, next) => {
  //   const accessToken = req.get("Authorization")?.split(" ")?.[1];
  //   if (accessToken) {
  //     const blacklist = await blacklistService.getBlackListByToken(accessToken);
  //     if (blacklist) {
  //       throw new resUtil.CatchError({
  //         status: 401,
  //         message: "Token BlackList",
  //       });
  //     }
  //   }
  //   const { userId, exp } = jwtUtil.user.decodeToken(accessToken);

  //   const user = await userService.getUserByPk(userId);
  //   if (!user) {
  //     throw new resUtil.CatchError({ status: 403, message: "User Blocked" });
  //   }
  //   req.user = {
  //     ...user.dataValues,
  //     accessToken,
  //     exp,
  //   };
  //   return next();
  // }),
  requireAuth: resUtil.catchError(async (req, res, next) => {
    const accessToken = req.get("Authorization")?.split(" ")?.[1];
    if (accessToken) {
      const blacklist = await blacklistService.getBlackListByToken(accessToken);
      if (blacklist) {
        throw new resUtil.CatchError({
          status: 401,
          message: "Token BlackList",
        });
      }
    }
    const { userId, exp } = jwtUtil.user.decodeToken(accessToken);

    const user = await userService.getUserByPk(userId);
    if (!user) {
      throw new resUtil.CatchError({ status: 403, message: "User Blocked" });
    }
    req.user = {
      ...user.dataValues,
      accessToken,
      exp,
    };
    return next();
  }),
  optionalAuth: resUtil.catchError(async (req, res, next) => {
    req.user = null;

    const accessToken = req.get("Authorization")?.split(" ")?.[1];

    if (accessToken) {
      try {
        const { userId, exp } = jwtUtil.user.decodeToken(accessToken);
        const user = await userService.getUserByPk(userId);

        req.user = {
          ...user.dataValues,
          accessToken,
          exp,
        };
      } catch (error) {
        req.user = null;
      }
    }
    return next();
  }),
};
