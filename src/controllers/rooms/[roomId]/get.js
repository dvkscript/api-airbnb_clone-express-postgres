const roomService = require("../../../services/room.service");
const { RoomDetailTransformer } = require("../../../transformers/room.transformer");
const resUtil = require("../../../utils/res.util");

module.exports = resUtil.catchError(
    async (req, res, next) => {
        const roomId = req.params.roomId;
        console.log(roomId,6666666666);
        
        const currentUserId = req?.user?.id;
        const result = await roomService.getRoomDetails(roomId, currentUserId);
        if (!result) {
            throw new resUtil.CatchError({
                status: 404,
                message: "Room not found"
            });
        }
        const data = new RoomDetailTransformer(result, req);
        return resUtil.success(res, {
            message: "success",
            data
        })
    }
)