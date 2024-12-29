var express = require('express');
var router = express.Router();
const profileUserController = require('../../../../../controllers/user/profile.user.controller');
const methodMiddleware = require('../../../../../middlewares/method.middleware');

router.use("/profile", methodMiddleware("GET"));
router.get("/profile", profileUserController);

module.exports = router;
