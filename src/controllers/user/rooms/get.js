const roomService = require("../../../services/room.service");
const { UserRoomListTransformer } = require("../../../transformers/room.transformer");
const resUtil = require("../../../utils/res.util");

module.exports = resUtil.catchError(async (req, res, next) => {
    const query = req.query;
    const userId = req.user.id;

    const result = await roomService.getRoomAndCountAllByUserId(userId, query);

    if (!result) {
        throw new resUtil.CatchError({
            status: 500,
            message: "Server error"
        });
    };

    const data = {
        count: result.count,
        rows: new UserRoomListTransformer(result.rows, req),
    }

    return resUtil.success(res, {
        status: 200,
        message: "success",
        data
    })
})