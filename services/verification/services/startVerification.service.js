const logger = require('../utils/logger');
const { publishKafkaEvent } = require('../utils/kafkaClient');
const { setVerificationData } = require('../utils/verificationCache');
const { ERROR_STATUS } = require('../utils/httpErrorMap');

/**
 * Démarre la vérification d'un ticket sans consulter le Ticket Service
 * @param {object} payload - données reçues du front { ticketId, userId, signature, status? }
 * @param {boolean} isMock - mode mock/live
 */
async function startVerificationService(payload, isMock = false) {
  const { ticketId, userId, signature, status = 'VALID' } = payload;

  // 🔹 Log complet du payload reçu
  logger.info('[VERIFICATION SERVICE] Payload reçu', { ticketId, userId, signature, status, isMock });

  const numericId = Number(ticketId);
  if (!ticketId || isNaN(numericId)) {
    const err = new Error('INVALID_TICKET_ID');
    err.statusCode = ERROR_STATUS.INVALID_TICKET_ID;
    throw err;
  }

  if (!userId || !signature) {
    const err = new Error('MISSING_REQUIRED_FIELDS');
    err.statusCode = ERROR_STATUS.INVALID_PAYLOAD;
    throw err;
  }

  // 🔹 Vérification stricte du statut
  if (status !== 'VALID') {
    const err = new Error('TICKET_NOT_VALID');
    err.statusCode = ERROR_STATUS.TICKET_NOT_VALID;
    logger.error('[VERIFICATION SERVICE] Ticket non valide pour vérification', { ticketId: numericId, status });
    throw err;
  }

  logger.info(`[VERIFICATION SERVICE] Démarrage vérification pour ticket ${numericId}`);

  // 🔹 Mise en cache
  setVerificationData(numericId, { status, userId, signature, mode: isMock ? 'mock' : 'live' });

  // 🔹 Publication Kafka "started"
  try {
    await publishKafkaEvent('ticket', {
      type: 'TicketVerificationStarted',
      ticketId: numericId,
      status,
      userId,
      mode: isMock ? 'mock' : 'live'
    });
    logger.info(`[VERIFICATION SERVICE] Kafka event TicketVerificationStarted publié`, { ticketId: numericId });
  } catch (err) {
    logger.warn(`[VERIFICATION SERVICE] Kafka publish failed: ${err.message}`, { ticketId: numericId });
  }

  // 🔹 Retourne ce qu'on a reçu
  return { ticketId: numericId, status, userId, signature };
}

module.exports = { startVerificationService };
