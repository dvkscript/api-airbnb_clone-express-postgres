var express = require('express');
const structuresController = require('../../../../controllers/structures');
const methodMiddleware = require('../../../../middlewares/method.middleware');
var router = express.Router();

router.use("/structures", methodMiddleware("GET"));
router.get("/structures", structuresController.get);

module.exports = router;
