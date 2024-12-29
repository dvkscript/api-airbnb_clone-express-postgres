const blacklistService = require("../../services/blacklist.service");
const userTokenService = require("../../services/userToken.service");
const resUtil = require("../../utils/res.util");

module.exports = resUtil.catchError(
    async (req, res, next) => {
        const { accessToken, exp, id } = req.user;

        const refreshToken = req.body.refresh_token;

        const [] = await Promise.all([
            blacklistService.createBlackList(accessToken, exp),
            refreshToken ? userTokenService.deleteUserToken(refreshToken, id) : null
        ]);

        return resUtil.success(res, {
            status: 200,
            message: "success",
            data: null
        })
    }
) 