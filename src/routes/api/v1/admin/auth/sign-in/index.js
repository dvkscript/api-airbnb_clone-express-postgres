var express = require('express');
const AuthProvider = require('../../../../../../enums/authProvider');
const localAuthController = require('../../../../../../controllers/auth/local.auth.controller');
var router = express.Router();

const provider = AuthProvider.LOCAL_ADMIN;

router.post("/sign-in", localAuthController.signIn(provider));

module.exports = router;
