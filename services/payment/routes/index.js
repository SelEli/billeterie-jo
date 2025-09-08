const express = require('express');
const router = express.Router();

router.use('/payment', require('./payment.routes'));

module.exports = router;
