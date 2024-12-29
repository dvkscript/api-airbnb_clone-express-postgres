const resUtil = require("../utils/res.util");

module.exports = (...methods) =>
  resUtil.catchError(async (req, res, next) => {
    if (!methods.includes(req.method)) {
      throw new resUtil.CatchError({
        status: 405,
        message: "Method not allowed",
      });
    }
    next();
  });
