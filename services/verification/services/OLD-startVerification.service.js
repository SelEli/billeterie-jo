const axios = require('axios');
const logger = require('../utils/logger');
const { publishKafkaEvent } = require('../utils/kafkaClient');
const { ERROR_STATUS } = require('../utils/httpErrorMap');

async function startVerificationService(ticketId, authHeader = null) {
  const numericId = Number(ticketId);
  if (!numericId) {
    const err = new Error('INVALID_TICKET_ID');
    err.statusCode = ERROR_STATUS.INVALID_TICKET_ID;
    throw err;
  }

  logger.info(`[VERIFICATION SERVICE] Démarrage vérification pour ticket ${numericId}`);

  let ticketResp;
  try {
    ticketResp = await axios.get(`${process.env.TICKET_URL}/${numericId}`, {
      headers: authHeader ? { Authorization: authHeader } : {}
    });
  } catch (err) {
    logger.error('[VERIFICATION SERVICE] Impossible de récupérer le ticket', { ticketId: numericId, error: err.message });
    throw new Error('TICKET_FETCH_FAILED');
  }

  const ticketData = ticketResp.data?.data;
  if (!ticketData || !ticketData.status) {
    logger.error('[VERIFICATION SERVICE] Ticket-Service returned invalid data', ticketResp.data);
    throw new Error('INVALID_TICKET_STATUS');
  }

  // Kafka: signalement sans statut
  try {
    await publishKafkaEvent('ticket', {
      type: 'VerificationStarted',
      ticketId: numericId,
      startedAt: new Date().toISOString(),
    });
    logger.info(`[VERIFICATION SERVICE] Kafka event VerificationStarted publié pour ticket ${numericId}`);
  } catch (err) {
    logger.warn(`[VERIFICATION SERVICE] Kafka publish failed: ${err.message}`, { ticketId: numericId });
  }

  return { ticketId: numericId };
}

module.exports = { startVerificationService };
