var express = require("express");
const methodMiddleware = require("../../../../../middlewares/method.middleware");
const authMiddleware = require("../../../../../middlewares/auth.middleware");
const { get } = require("../../../../../controllers/rooms/[roomId]");
const post = require("../../../../../controllers/rooms/[roomId]/booking");
var router = express.Router();

//room booking
router.use("/:roomId/booking", methodMiddleware("POST"));
router.use("/:roomId/booking", authMiddleware.requireAuth);
router.post("/:roomId/booking", post);

//room detail
router.use("/:roomId", methodMiddleware("GET"));
router.get("/:roomId", get);

module.exports = router;
