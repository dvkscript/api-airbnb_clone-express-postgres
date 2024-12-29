const roomService = require("../../services/room.service");
const { RoomListTransformer } = require("../../transformers/room.transformer");
const resUtil = require("../../utils/res.util");

module.exports = resUtil.catchError(async (req, res, next) => {
  const currentUserId = req?.user?.id;
  
  const result = await roomService.getRoomAndCountAll(req.query, currentUserId);
  if (!result) {
    throw new resUtil.CatchError({
      status: 500,
      message: "Server error",
    });
  }
  const data = {
    count: result.count,
    rows: new RoomListTransformer(result.rows, req),
  };

  return resUtil.success(res, {
    status: 200,
    message: "success",
    data,
  });
});
