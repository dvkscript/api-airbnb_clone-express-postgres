var express = require("express");
const { get, post } = require("../../../../../controllers/user/wishlists");
const methodMiddleware = require("../../../../../middlewares/method.middleware");
var router = express.Router();

router.use("/wishlists", require("./[wishlistId]"));

router.use("/wishlists", methodMiddleware("GET", "POST"));

router.get("/wishlists", get);
router.post("/wishlists", post);

module.exports = router;
