const authService = require("../../services/auth.service");
const resUtil = require("../../utils/res.util");
const authValidator = require("../../validators/auth.validator");

module.exports = resUtil.catchError(async (req, res, next) => {
  const body = await req.validate(req.body, authValidator.signUp);

  const data = await authService.signUp(body);

  return resUtil.success(res, {
    status: 201,
    message: "success",
    data,
  });
});
