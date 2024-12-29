const userService = require("../../../services/user.service");
const { UserWishlistTransformer } = require("../../../transformers/user.transformer");
const resUtil = require("../../../utils/res.util");

module.exports = resUtil.catchError(async (req, res, next) => {
  const userId = req?.user?.id;
  const data = await userService.getWishlists(userId);
  if (!data) {
    throw new resUtil.CatchError({
      status: 500,
      message: "Server Error",
    });
  }
  return resUtil.success(res, {
    message: "success",
    data: new UserWishlistTransformer(data, req),
  });
});
