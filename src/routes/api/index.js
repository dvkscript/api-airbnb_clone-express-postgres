var express = require("express");
var router = express.Router();

const validateMiddleware = require("../../middlewares/validate.middleware");

router.use("/api", validateMiddleware);

router.use("/api", require("./v1"));

module.exports = router;
