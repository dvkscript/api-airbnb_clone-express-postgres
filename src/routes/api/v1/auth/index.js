var express = require('express');
var router = express.Router();

router.use("/auth", require("./sign-in"));
router.use("/auth", require("./sign-up"));
router.use("/auth", require("./refresh-token"));
router.use("/auth", require("./google"));
router.use("/auth", require("./github"));

module.exports = router;
