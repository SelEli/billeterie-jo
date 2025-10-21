const axios = require('axios');
const logger = require('../utils/logger');
const { publishKafkaEvent } = require('../utils/kafkaClient');
const { setPaymentData } = require('../utils/paymentCache');
const { ERROR_STATUS } = require('../utils/httpErrorMap');

async function startPaymentService(ticketId, user, isMock = false) {
  const numericId = Number(ticketId);
  if (!numericId) {
    const err = new Error('INVALID_TICKET_ID');
    err.statusCode = ERROR_STATUS.INVALID_TICKET_ID;
    throw err;
  }

  logger.info('[PAYMENT SERVICE] Démarrage paiement', {
    ticketId: numericId,
    isMock,
    user
  });

  // 🔑 Utilisation du middleware : req.user.token et req.user.cookie
  const headers = {
    ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}),
    ...(user?.cookie ? { cookie: user.cookie } : {})
  };
  logger.debug('[PAYMENT SERVICE] Headers envoyés vers Ticket Service', headers);

  let ticketResp;
  try {
    ticketResp = await axios.get(`${process.env.TICKET_URL}/${numericId}`, {
      headers,
      withCredentials: true
    });
    logger.info('[PAYMENT SERVICE] Réponse Ticket Service brute', {
      status: ticketResp.status,
      data: ticketResp.data
    });
  } catch (err) {
    logger.error('[PAYMENT SERVICE] Impossible de récupérer le ticket', {
      ticketId: numericId,
      error: err.message,
      response: err.response?.data
    });
    const e = new Error('TICKET_FETCH_FAILED');
    e.statusCode = ERROR_STATUS.TICKET_FETCH_FAILED || 500;
    throw e;
  }

  const amount = ticketResp.data?.data?.price;
  const status = ticketResp.data?.data?.status;

  logger.info('[PAYMENT SERVICE] Ticket récupéré', { amount, status });

  if (typeof amount !== 'number') {
    logger.error('[PAYMENT SERVICE] Réponse ticket-service invalide', ticketResp.data);
    const e = new Error('INVALID_TICKET_PRICE');
    e.statusCode = ERROR_STATUS.INVALID_TICKET_PRICE || 400;
    throw e;
  }

  setPaymentData(numericId, { amount, mode: isMock ? 'mock' : 'live' });
  if (isMock) logger.debug('[PAYMENT SERVICE] Mode mock : paiement simulé');

  try {
    await publishKafkaEvent('ticket', {
      type: 'PaymentStarted',
      ticketId: numericId,
      amount,
      startedAt: new Date().toISOString(),
      mode: isMock ? 'mock' : 'live'
    });
    logger.info('[PAYMENT SERVICE] Événement Kafka PaymentStarted publié');
  } catch (err) {
    logger.warn('[PAYMENT SERVICE] Kafka publish failed', { error: err.message });
  }

  return { ticketId: numericId, amount, status };
}

module.exports = { startPaymentService };
