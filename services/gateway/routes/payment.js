// routes/payment.js
const express = require('express');
const router = express.Router();
const proxyRequest = require('../proxy/proxyRequest');

router.use('/', proxyRequest(process.env.PAYMENT_SERVICE_URL));

module.exports = router;
