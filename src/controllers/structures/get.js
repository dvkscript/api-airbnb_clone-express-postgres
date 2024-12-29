const structureService = require("../../services/structure.service");
const resUtil = require("../../utils/res.util");

module.exports = resUtil.catchError(async (req, res, next) => {
    const query = req.query;

    const result = await structureService.getStructureAndCountAll(query);

    if (!result) {
        throw new resUtil.CatchError({
            status: 500,
            message: "Server error"
        });
    }

    const data = {
        count: result.count,
        rows: result.rows.map(s => ({
            ...s,
            photo: resUtil.imageParse(req, s.photo)
        }))
    }

    return resUtil.success(res, {
        status: 200,
        message: "success",
        data
    });
})  