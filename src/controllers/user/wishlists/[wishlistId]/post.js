const userService = require("../../../../services/user.service");
const resUtil = require("../../../../utils/res.util");
const userValidator = require("../../../../validators/user.validator");

module.exports = resUtil.catchError(async (req, res, next) => {
  const wishlistId = req.params.wishlistId;

  const body = await req.validate(
    req.body,
    userValidator.wishlists["[wishlistId]"].post
  );

  const data = await userService.wishlistAddOrRemoveRoom(
    req.user.id,
    {
        ...body,
        wishlistId
    }
  );

  if (!data) {
    throw new resUtil.CatchError({
      status: 500,
      message: "Server error",
    });
  }

  return resUtil.success(res, {
    status: 200,
    message: "success",
    data,
  });
});
