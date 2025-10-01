//
const axios = require('axios');
const logger = require('../utils/logger');
const { publishKafkaEvent } = require('../utils/kafkaClient');
const { setPaymentData } = require('../utils/paymentCache');
const { ERROR_STATUS } = require('../utils/httpErrorMap');

async function startPaymentService(ticketId, authHeader, isMock = false) {
  const numericId = Number(ticketId);
  if (!numericId) {
    const err = new Error('INVALID_TICKET_ID');
    err.statusCode = ERROR_STATUS.INVALID_TICKET_ID;
    throw err;
  }

  logger.info(`[PAYMENT SERVICE] Démarrage paiement pour ticket ${numericId} (mock=${isMock})`);

  // Récupération ticket depuis Ticket Service
  let ticketResp;
  try {
    ticketResp = await axios.get(
      `${process.env.TICKET_URL}/${numericId}`,
      { headers: authHeader ? { Authorization: authHeader } : {} }
    );
  } catch (err) {
    logger.error('[PAYMENT SERVICE] Impossible de récupérer le ticket', { ticketId: numericId, error: err.message });
    throw new Error('TICKET_FETCH_FAILED');
  }

  const amount = ticketResp.data?.data?.price;
  const status = ticketResp.data?.data?.status;

  if (typeof amount !== 'number') {
    logger.error('[PAYMENT SERVICE] Réponse ticket-service invalide', ticketResp.data);
    throw new Error('INVALID_TICKET_PRICE');
  }

  // Mise en cache
  setPaymentData(numericId, { amount, mode: isMock ? 'mock' : 'live' });

  if (isMock) logger.debug('[PAYMENT SERVICE] Mode mock : paiement simulé');

  // Publication Kafka
  try {
    await publishKafkaEvent('ticket', {
      type: 'PaymentStarted',
      ticketId: numericId,
      amount,
      startedAt: new Date().toISOString(),
      mode: isMock ? 'mock' : 'live'
    });
  } catch (err) {
    logger.warn(`[PAYMENT SERVICE] Kafka publish failed: ${err.message}`, { ticketId: numericId });
  }

  return { ticketId: numericId, amount, status };
}

module.exports = { startPaymentService };
