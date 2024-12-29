var express = require('express');
const refreshTokenAuthController = require('../../../../../controllers/auth/refresh-token.auth.controller');
const AuthProvider = require('../../../../../enums/authProvider');
const methodMiddleware = require('../../../../../middlewares/method.middleware');
var router = express.Router();

router.use("/refresh-token", methodMiddleware("POST"));
router.post("/refresh-token", refreshTokenAuthController(AuthProvider.USER_REFRESH_TOKEN));

module.exports = router;
