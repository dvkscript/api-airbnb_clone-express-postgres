const resUil = require("../../utils/res.util");
const amenityService = require("../../services/amenity.service");
const resUtil = require("../../utils/res.util");
const {
  AmenityListTransformer,
} = require("../../transformers/amenity.transformer");

module.exports = resUil.catchError(async (req, res, next) => {
  const query = req.query;

  const result = await amenityService.getAmenityAndCountAll(query);
  if (!result) {
    throw new resUil.CatchError({
      status: 500,
      message: "Server error",
    });
  }

  const data = {
    count: result.count,
    rows: new AmenityListTransformer(result.rows, req),
  };

  return resUil.success(res, {
    status: 200,
    message: "success",
    data,
  });
});
