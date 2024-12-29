var express = require('express');
var router = express.Router();

router.use("/admin", require("./auth"));

module.exports = router;
