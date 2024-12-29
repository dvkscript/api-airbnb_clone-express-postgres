const roomService = require("../../../services/room.service");
const resUtil = require("../../../utils/res.util");
const userValidator = require("../../../validators/user.validator");

module.exports = resUtil.catchError(
    async (req, res, next) => {
        const {ids} = await req.validate(req.body, userValidator.rooms.delete);
        const result = await roomService.deleteUserRooms(req.user.id, ids);
        if (!result) {
            throw new resUtil.CatchError({
                status: 500,
                message: "Server error"
            })
        }
        return resUtil.success(res, {
            status: 200,
            message: "success"
        })
    }
)