const resUtil = require("../../utils/res.util");
const photoValidator = require("../../validators/photo.validator");
const photoService = require("../../services/photo.service")

module.exports = resUtil.catchError(async (req, res, next) => {
    const body = await req.validate(req.body, photoValidator.delete);

    const ids = body.ids;

    const data = await photoService.deletePhoto(ids);
    if (!data) {
        throw new resUtil.CatchError({
            status: 500,
            message: "Server error",
        })
    }
    return resUtil.success(res, {
        status: 200,
        message: "Success",
        data
    })
})