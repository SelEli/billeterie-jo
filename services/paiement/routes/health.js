const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'paiement',
    requestId: req.requestId || null
  });
});

module.exports = router;