const userService = require("../../../services/user.service");
const resUtil = require("../../../utils/res.util");
const userValidator = require("../../../validators/user.validator");

module.exports = resUtil.catchError(
    async (req, res, next) => {
        const { name } = await req.validate(req.body, userValidator.favorites.post);
        const userId = req.user.id;
        const data = await userService.createWishlist(userId, name);
        if (!data) {
            throw new resUtil.CatchError({
                status: 500,
                message: "Server error"
            })
        }
        return resUtil.success(res, {
            message: "success",
            data
        })
    }
)