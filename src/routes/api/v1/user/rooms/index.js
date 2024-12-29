var express = require("express");
const userRoomsController = require("../../../../../controllers/user/rooms");
const methodMiddleware = require("../../../../../middlewares/method.middleware");
var router = express.Router();

router.use("/rooms", require("./[roomId]"));

router.use("/rooms", methodMiddleware("GET", "POST", "DELETE"));
router.get("/rooms", userRoomsController.get);
router.post("/rooms", userRoomsController.post);
router.delete("/rooms", userRoomsController.delete);

module.exports = router;
