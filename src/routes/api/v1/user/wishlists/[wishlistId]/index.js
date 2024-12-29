var express = require('express');
const { post } = require('../../../../../../controllers/user/wishlists/[wishlistId]');
const methodMiddleware = require('../../../../../../middlewares/method.middleware');
var router = express.Router();

router.use("/:wishlistId", methodMiddleware("POST"));

router.post("/:wishlistId", post);

module.exports = router;
