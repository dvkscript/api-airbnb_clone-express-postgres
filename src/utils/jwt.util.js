const jwt = require("jsonwebtoken");
const envConfig = require("../configs/env.config");
const resUtil = require("./res.util");

const jwtUtil = {
  admin: {
    createAccessToken: (data = {}) => {
      try {
        if (!envConfig.JWT_ADMIN_SECRET) {
          throw new resUtil.CatchError({
            status: 500,
            message: "JWT_SECRET Not Found",
          });
        }
        return jwt.sign(data, envConfig.JWT_ADMIN_SECRET, {
          expiresIn: envConfig.JWT_ADMIN_ACCESS_TOKEN_EXPIRE,
        });
      } catch (error) {
        throw new resUtil.CatchError({
          status: error.status,
          message: error.message,
        });
      }
    },
    createRefreshToken: () => {
      if (!envConfig.JWT_ADMIN_SECRET) {
        throw new resUtil.CatchError({
          status: 500,
          message: "JWT_SECRET Not Found",
        });
      }
      try {
        const data = Math.random() + new Date().getTime();
        return jwt.sign({ data }, envConfig.JWT_ADMIN_SECRET, {
          expiresIn: envConfig.JWT_ADMIN_REFRESH_TOKEN_EXPIRE,
        });
      } catch (error) {
        throw new resUtil.CatchError({
          status: error.status,
          message: error.message,
        });
      }
    },
    decodeToken: (token) => {
      if (!envConfig.JWT_ADMIN_SECRET) {
        throw new resUtil.CatchError({
          status: 500,
          message: "JWT_SECRET Not Found",
        });
      }
      try {
        return jwt.verify(token, envConfig.JWT_ADMIN_SECRET);
      } catch (error) {
        throw new resUtil.CatchError({
          status: 401,
          message: "Token expired",
        });
      }
    },
  },
  user: {
    createAccessToken: (data = {}) => {
      try {
        if (!envConfig.JWT_USER_SECRET) {
          throw new resUtil.CatchError({
            status: 500,
            message: "JWT_SECRET Not Found",
          });
        }
        return jwt.sign(data, envConfig.JWT_USER_SECRET, {
          expiresIn: envConfig.JWT_USER_ACCESS_TOKEN_EXPIRE,
        });
      } catch (error) {
        throw new resUtil.CatchError({
          status: error.status,
          message: error.message,
        });
      }
    },
    createRefreshToken: () => {
      if (!envConfig.JWT_USER_SECRET) {
        throw new resUtil.CatchError({
          status: 500,
          message: "JWT_SECRET Not Found",
        });
      }
      try {
        const data = Math.random() + new Date().getTime();
        return jwt.sign({ data }, envConfig.JWT_USER_SECRET, {
          expiresIn: envConfig.JWT_USER_REFRESH_TOKEN_EXPIRE,
        });
      } catch (error) {
        throw new resUtil.CatchError({
          status: error.status,
          message: error.message,
        });
      }
    },
    decodeToken: (token) => {
      if (!envConfig.JWT_USER_SECRET) {
        throw new resUtil.CatchError({
          status: 500,
          message: "JWT_SECRET Not Found",
        });
      }
      try {
        return jwt.verify(token, envConfig.JWT_USER_SECRET);
      } catch (error) {
        throw new resUtil.CatchError({
          status: 401,
          message: "Token expired",
        });
      }
    },
  },
};

module.exports = jwtUtil;