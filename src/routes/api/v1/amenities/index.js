var express = require('express');
var router = express.Router();
const amenitiesController = require("../../../../controllers/amenities")

router.get("/amenities", amenitiesController.get);

module.exports = router;
