// src/routes/auth.js
const express = require('express');
const { sendOtpHandler, verifyOtpHandler } = require('../controllers/auth');

const router = express.Router();

router.post('/send-otp', ...sendOtpHandler);
router.post('/verify-otp', ...verifyOtpHandler);

module.exports = router;