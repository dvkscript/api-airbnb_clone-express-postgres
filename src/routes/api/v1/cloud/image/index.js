var express = require("express");
const imageCloudController = require("../../../../../controllers/cloud/image.cloud.controller");
const methodMiddleware = require("../../../../../middlewares/method.middleware");
var router = express.Router();

// router.use("/", methodMiddleware("GET"));
router.get("/image/:publicId", imageCloudController);

router.get("/image/*/:publicId", imageCloudController);

// router.get("/image/:randomId/:folderName/:publicId", imageCloudController);
// router.get("/image/:randomId/*/:publicId", imageCloudController);

module.exports = router;
