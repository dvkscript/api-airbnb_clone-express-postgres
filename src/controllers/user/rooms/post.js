const roomService = require("../../../services/room.service");
const resUtil = require("../../../utils/res.util");
const userValidator = require("../../../validators/user.validator");

module.exports = resUtil.catchError(async (req, res, next) => {
  const body = await req.validate(req.body, userValidator.rooms.post);

  const data = await roomService.createUserRoom(req.user.id, body);

  if (!data) {
    throw new resUtil.CatchError({
      status: 500,
      message: "Server error",
    });
  }

  return resUtil.success(res, {
    status: 200,
    message: "success",
    data
  });
});
