var express = require("express");
var router = express.Router();
const { get } = require("../../../../controllers/rooms");
const methodMiddleware = require("../../../../middlewares/method.middleware");
const authMiddleware = require("../../../../middlewares/auth.middleware");

router.use("/rooms", authMiddleware.optionalAuth);

router.use("/rooms", require("./[roomId]"));

router.use("/rooms", methodMiddleware("GET"));
router.get("/rooms", get);

module.exports = router;
