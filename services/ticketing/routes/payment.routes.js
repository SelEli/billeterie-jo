// routes/payment.routes.js
const express = require('express');
const router = express.Router();
const prisma = require('../utils/prismaClient');
const axios = require('axios');
const logger = require('../utils/logger');

router.post('/start', async (req, res) => {
  const { ticketId } = req.body;

  try {
    // On récupère le compte technique
    const paymentUser = await prisma.user.findUnique({
      where: { id: Number(process.env.PAYMENT_SERVICE_USER_ID) }
    });
    if (!paymentUser) {
      return res.status(500).json({ error: 'PAYMENT_USER_NOT_FOUND' });
    }

    // On génère un JWT pour ce compte technique
    const jwt = require('../utils/jwt').sign({
      userId: paymentUser.id,
      role: paymentUser.role
    });

    // On appelle l’endpoint interne /ticket/validate avec ce JWT
    const out = await axios.post(
      `${process.env.API_BASE_URL}/ticket/validate`,
      { ticketId },
      { headers: { Authorization: `Bearer ${jwt}` } }
    );

    return res.json(out.data);
  } catch (err) {
    logger.error('[PAYMENT MOCK] Error', err);
    return res.status(500).json({ error: 'PAYMENT_MOCK_FAILED' });
  }
});

module.exports = router;
