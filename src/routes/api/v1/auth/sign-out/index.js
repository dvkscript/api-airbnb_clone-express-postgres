var express = require('express');
const signOutAuthController = require('../../../../../controllers/auth/signOut.auth.controller');
const methodMiddleware = require('../../../../../middlewares/method.middleware');
var router = express.Router();

router.use("/sign-out", methodMiddleware("POST"));
router.post("/sign-out", signOutAuthController);

module.exports = router;
