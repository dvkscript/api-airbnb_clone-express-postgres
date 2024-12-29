var express = require('express');
var router = express.Router();
const photosController = require("../../../../controllers/photos");

router.delete("/photos", photosController.delete);

module.exports = router;
