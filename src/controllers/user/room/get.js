const roomService = require("../../../services/room.service");
const { UserRoomTransformer } = require("../../../transformers/user.transformer");
const resUtil = require("../../../utils/res.util");

module.exports = resUtil.catchError(async (req, res, next) => {
  const roomId = req.params.roomId;
  const userId = req.user.id;

  const result = await roomService.getUserRoomById(userId, roomId);

  if (!result) {
    throw new Error({
      status: 404,
      message: "Room not found"
    })
  };

  const data = new UserRoomTransformer(result, req)

  return resUtil.success(res, {
    status: 200,
    message: "success",
    data,
  });
});
