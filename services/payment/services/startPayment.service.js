const axios = require('axios');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const { publishKafkaEvent } = require('../utils/kafkaClient');
const { setPaymentData } = require('../utils/paymentCache');

async function startPaymentService(ticketId, _amountFromFront, isMock = false) {
  const numericId = Number(ticketId);
  if (!numericId) {
    throw new Error('INVALID_TICKET_ID');
  }

  logger.info(`[PAYMENT SERVICE] Démarrage paiement pour ticket ${numericId} (mock=${isMock})`);

  // 🔐 Token technique AGENT
  const token = jwt.sign(
    {
      userId: Number(process.env.PAYMENT_SERVICE_USER_ID),
      role: 'AGENT'
    },
    process.env.JWT_SECRET,
    { expiresIn: '5m' }
  );

  // 📡 Récupération du prix réel depuis ticket-service
  const ticketResp = await axios.get(
    `${process.env.TICKET_URL}/${numericId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  const amount = ticketResp.data?.data?.price;
  if (typeof amount !== 'number') {
    logger.error('[PAYMENT SERVICE] Réponse ticket-service invalide', ticketResp.data);
    throw new Error('INVALID_TICKET_PRICE');
  }

  // 💾 Stockage en cache mémoire
  setPaymentData(numericId, { amount, mode: isMock ? 'mock' : 'live' });

  if (isMock) {
    logger.debug('[PAYMENT SERVICE] Mode mock : paiement simulé');
  }

  // 📢 Publication Kafka
  await publishKafkaEvent('ticket', {
    type: 'PaymentStarted',
    ticketId: numericId,
    amount,
    startedAt: new Date().toISOString(),
    mode: isMock ? 'mock' : 'live'
  });

  return { ticketId: numericId, amount, status: 'PENDING' };
}

module.exports = { startPaymentService };
