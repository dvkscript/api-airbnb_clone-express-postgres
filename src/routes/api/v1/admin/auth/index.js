var express = require('express');
var router = express.Router();

router.use("/auth", require("./google"));
router.use("/auth", require("./github"));
router.use("/auth", require("./sign-in"));

module.exports = router;
