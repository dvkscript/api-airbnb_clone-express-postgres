const roomService = require("../../../services/room.service");
const resUtil = require("../../../utils/res.util");
const userValidator = require("../../../validators/user.validator");

module.exports = resUtil.catchError(async (req, res, next) => {
  const roomId = req.params.roomId;

  const body = await req.validate(
    {
      ...req.body,
      roomId,
    },
    userValidator.rooms.patch.common
  );
  delete body.roomId;

  if (req.body.address) {
    body.address = await req.validate(
      req.body.address,
      userValidator.rooms.patch.address
    );
  }
  if (req.body.floorPlan) {
    body.floorPlan = await req.validate(
      req.body.floorPlan,
      userValidator.rooms.patch.floorPlan
    );
  }

  const data = await roomService.updateUserRoom(req.user.id, roomId, body);

  return resUtil.success(res, {
    status: 200,
    message: "success",
    data,
  });
});
