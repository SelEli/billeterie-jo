const axios = require('axios');
const { publishKafkaEvent } = require('../utils/kafkaClient');
const logger = require('../utils/logger');
const { ERROR_STATUS } = require('../utils/httpErrorMap');
const { getPaymentData, clearPaymentData } = require('../utils/paymentCache');

async function confirmPaymentService(ticketId, authHeader = null, isMock = false) {
  const numericId = Number(ticketId);
  if (!numericId) {
    const err = new Error('INVALID_TICKET_ID');
    err.statusCode = ERROR_STATUS.INVALID_TICKET_ID;
    throw err;
  }

  logger.info(`[PAYMENT SERVICE] Confirmation paiement pour ticket ${numericId} (mock=${isMock})`);

  // Récupération du cache
  const paymentInfo = getPaymentData(numericId);
  const amount = paymentInfo?.amount ?? null;
  const mode = paymentInfo?.mode ?? (isMock ? 'mock' : 'live');

  // 🔹 Validation directe du ticket via POST
  const url = `${process.env.TICKET_URL}/validate`;
  const body = { ticketId: numericId };
  const headers = authHeader ? { Authorization: authHeader } : {};

  logger.info('[PAYMENT SERVICE] Préparation requête validate', { url, body, headers });

  try {
    const resp = await axios.post(url, body, { headers });

    logger.info('[PAYMENT SERVICE] Réponse brute validate', {
      status: resp.status,
      data: resp.data,
      headers: resp.headers
    });

    const ticketStatus = resp.data?.data?.status || resp.data?.status;
    logger.info('[PAYMENT SERVICE] Statut renvoyé par ticket-service', { ticketStatus });

    if (ticketStatus !== 'VALID') {
      logger.error(`[PAYMENT SERVICE] Ticket ${numericId} non validé côté ticket-service`, resp.data);
      const err = new Error('TICKET_NOT_VALIDATED');
      err.statusCode = ERROR_STATUS.TICKET_NOT_VALIDATED || 500;
      throw err;
    }

    logger.info(`[PAYMENT SERVICE] Ticket ${numericId} validé avec succès`);
  } catch (err) {
    logger.error('[PAYMENT SERVICE] Erreur Ticket Service', {
      message: err.message,
      stack: err.stack,
      status: err.response?.status,
      data: err.response?.data,
      config: {
        method: err.config?.method,
        url: err.config?.url,
        data: err.config?.data,
        headers: err.config?.headers
      }
    });
    throw err;
  }

  // Nettoyage cache
  clearPaymentData(numericId);

  // Publication Kafka
  await publishKafkaEvent('ticket', {
    type: 'PaymentSucceeded',
    ticketId: numericId,
    amount,
    confirmedAt: new Date().toISOString(),
    mode
  });

  return { ticketId: numericId, amount, status: 'VALID' };
}

module.exports = { confirmPaymentService };
