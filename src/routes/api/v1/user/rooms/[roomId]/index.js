var express = require('express');
const userRoomController = require('../../../../../../controllers/user/room');
const methodMiddleware = require('../../../../../../middlewares/method.middleware');
var router = express.Router();

router.use("/:roomId", methodMiddleware("GET", "PATCH"));
router.get("/:roomId", userRoomController.get);
router.patch("/:roomId", userRoomController.patch);

module.exports = router;
