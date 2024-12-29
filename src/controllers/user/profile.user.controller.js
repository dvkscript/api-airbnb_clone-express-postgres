const userService = require("../../services/user.service");
const resUtil = require("../../utils/res.util");

module.exports = resUtil.catchError(async (req, res, next) => {
  if (!req.user) {
    throw new resUtil.CatchError({
      status: 404,
      message: "User not found",
    });
  };
  const user = await userService.getUserProfile({
    id: req.user.id
  });


  if (user?.profile?.thumbnail) {
    user.profile.thumbnail = resUtil.imageParse(req, user.profile.thumbnail); 
  }

  return resUtil.success(res, {
    message: "success",
    data: user
  })
});
