var express = require('express');
const authMiddleware = require('../../../middlewares/auth.middleware');
var router = express.Router();

router.use("/v1", require("./auth"));

router.use("/v1", require("./cloud"));

router.use("/v1", require("./rooms"));
router.use("/v1", require("./structures"));
router.use("/v1", require("./amenities"));

router.use("/v1", require("./admin"));


router.use("/v1", authMiddleware.requireAuth);

router.use("/v1/auth", require('./auth/sign-out'));

router.use("/v1", require("./user"));

router.use("/v1", require("./upload"));

router.use("/v1", require("./photos"));

module.exports = router;
