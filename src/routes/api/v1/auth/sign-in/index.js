var express = require('express');
const localAuthController = require('../../../../../controllers/auth/local.auth.controller');
const AuthProvider = require('../../../../../enums/authProvider');
const methodMiddleware = require('../../../../../middlewares/method.middleware');
var router = express.Router();

const provider = AuthProvider.LOCAL_USER;

router.use("/sign-in", methodMiddleware("POST"));
router.post("/sign-in", localAuthController.signIn(provider));

module.exports = router;
