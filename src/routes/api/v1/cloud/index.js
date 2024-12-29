var express = require('express');
var router = express.Router();

router.use("/cloud", require("./image"));

module.exports = router;
