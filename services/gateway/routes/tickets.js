// routes/tickets.js
const express = require('express');
const router = express.Router();
const proxyRequest = require('../proxy/proxyRequest');

router.use('/', proxyRequest(process.env.TICKET_SERVICE_URL));

module.exports = router;
