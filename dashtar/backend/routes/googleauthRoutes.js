const express = require('express');
const router = express.Router();
const { getGoogleAuthURL, googleCallback } = require('../controller/googleAuthController');

router.get('/google/url', getGoogleAuthURL);
router.get('/google/callback', googleCallback);

module.exports = router;
