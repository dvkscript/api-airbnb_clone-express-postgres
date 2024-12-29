var express = require('express');
var router = express.Router();

router.use("/upload", require('./image'));

module.exports = router;
