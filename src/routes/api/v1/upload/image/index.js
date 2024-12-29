var express = require('express');
var router = express.Router();
const imageUploadController = require('../../../../../controllers/upload/image.upload')

router.post("/image", imageUploadController);

module.exports = router;
