var express = require('express');
var router = express.Router();

router.use("/user", require("./profile"));
router.use("/user", require("./rooms"));
router.use("/user", require("./wishlists"));

module.exports = router;
