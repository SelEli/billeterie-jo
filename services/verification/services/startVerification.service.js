// services/startVerificationService.js
const axios = require('axios');
const logger = require('../utils/logger');
const { publishKafkaEvent } = require('../utils/kafkaClient');
const { ERROR_STATUS } = require('../utils/httpErrorMap');

/**
 * Démarre la vérification d’un ticket (statut INITIAL : STARTED)
 * @param {number|string} ticketId
 * @param {string|null} authHeader
 */
async function startVerificationService(ticketId, authHeader = null) {
  const numericId = Number(ticketId);
  if (!numericId) {
    const err = new Error('INVALID_TICKET_ID');
    err.statusCode = ERROR_STATUS.INVALID_TICKET_ID;
    throw err;
  }

  logger.info(`[VERIFICATION SERVICE] Démarrage vérification pour ticket ${numericId}`);

  // 🔹 Récupération ticket depuis Ticket Service
  let ticketResp;
  try {
    ticketResp = await axios.get(`${process.env.TICKET_URL}/${numericId}`, {
      headers: authHeader ? { Authorization: authHeader } : {}
    });
    logger.info('[VERIFICATION SERVICE] Ticket récupéré', { ticketId: numericId, data: ticketResp.data });
  } catch (err) {
    logger.error('[VERIFICATION SERVICE] Impossible de récupérer le ticket', {
      ticketId: numericId,
      message: err.message,
      stack: err.stack,
      config: err.config
    });
    throw new Error('TICKET_FETCH_FAILED');
  }

  const status = ticketResp.data?.data?.status;
  if (!status) {
    logger.error('[VERIFICATION SERVICE] Réponse ticket-service invalide', ticketResp.data);
    throw new Error('INVALID_TICKET_STATUS');
  }

  // 🔹 Publication Kafka
  try {
    await publishKafkaEvent('ticket', {
      type: 'VerificationStarted',
      ticketId: numericId,
      startedAt: new Date().toISOString()
    });
    logger.info(`[VERIFICATION SERVICE] Kafka event VerificationStarted publié pour ticket ${numericId}`);
  } catch (err) {
    logger.warn(`[VERIFICATION SERVICE] Kafka publish failed: ${err.message}`, { ticketId: numericId });
  }

  return { ticketId: numericId, status: 'STARTED' };
}

module.exports = { startVerificationService };

