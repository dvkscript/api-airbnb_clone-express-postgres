var express = require('express');
const signUpAuthController = require('../../../../../controllers/auth/signUp.auth.controller');
const methodMiddleware = require('../../../../../middlewares/method.middleware');
var router = express.Router();

router.use("/sign-up", methodMiddleware("POST"));
router.post("/sign-up", signUpAuthController);

module.exports = router;
