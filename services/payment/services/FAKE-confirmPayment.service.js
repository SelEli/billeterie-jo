const axios = require('axios');
const { publishKafkaEvent } = require('../utils/kafkaClient');
const logger = require('../utils/logger');

async function confirmPaymentService(ticketId, authHeader = null, isMock = false) {
  const numericId = Number(ticketId);
  if (!numericId) throw new Error('INVALID_TICKET_ID');

  logger.info(`[PAYMENT SERVICE] Confirmation paiement pour ticket ${numericId} (mock=${isMock})`);

  const url = `https://ticketing-production-af26.up.railway.app/ticket/validate`;
  const body = { ticketId: numericId };
  const headers = authHeader ? { Authorization: authHeader } : {};

  logger.info('[PAYMENT SERVICE] Envoi POST direct vers Ticket Service', { url, body, headers });

  let resp;
  try {
    resp = await axios.post(url, body, { headers });
    logger.info('[PAYMENT SERVICE] Ticket Service répondu', { status: resp.status, data: resp.data });
  } catch (err) {
    logger.error('[PAYMENT SERVICE] Erreur Ticket Service', {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data
    });
    throw err;
  }

  // 🔹 Publication Kafka (on garde)
  await publishKafkaEvent('ticket', {
    type: 'PaymentSucceeded',
    ticketId: numericId,
    amount: resp.data?.data?.price ?? null,
    confirmedAt: new Date().toISOString(),
    mode: isMock ? 'mock' : 'live'
  });

  return { ticketId: numericId, amount: resp.data?.data?.price ?? null, status: 'VALID' };
}

module.exports = { confirmPaymentService };
