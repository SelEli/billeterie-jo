// services/verification/startVerification.service.js
const logger = require('../utils/logger');
const { publishKafkaEvent } = require('../utils/kafkaClient');
const { setVerificationData } = require('../utils/verificationCache');
const { ERROR_STATUS } = require('../utils/httpErrorMap');
const axios = require('axios');

/**
 * Appelle le service /verify pour valider un ticket
 * @param {number} ticketId
 * @param {string} signature
 * @param {string|null} authHeader
 */
async function callVerifyTicket(ticketId, signature, authHeader) {
  try {
    // Si aucun authHeader fourni, on utilise la clé d'API du backend si définie
    const headers = authHeader
      ? { Authorization: authHeader }
      : process.env.TICKET_API_KEY
      ? { Authorization: `Bearer ${process.env.TICKET_API_KEY}` }
      : {};

    const res = await axios.post(
      `${process.env.TICKET_URL}/verify`,
      { ticketId, signature },
      { headers }
    );
    logger.info('[VERIFICATION SERVICE] Ticket vérifié via /verify', { ticketId });
    return res.data; // retourne ticket + user
  } catch (err) {
    logger.error('[VERIFICATION SERVICE] Échec appel /verify', { ticketId, error: err.message });
    throw err;
  }
}

/**
 * Démarre la vérification d'un ticket depuis le front
 * @param {object} payload - { ticketId, userId, signature, status? }
 * @param {boolean} isMock - mode mock/live
 * @param {string|null} authHeader - header Authorization
 */
async function startVerificationService(payload, isMock = false, authHeader = null) {
  const { ticketId, userId, signature, status = 'VALID' } = payload;

  logger.info('[VERIFICATION SERVICE] Payload reçu', { ticketId, userId, signature, status, isMock });

  const numericId = Number(ticketId);
  if (!ticketId || isNaN(numericId)) {
    const err = new Error('INVALID_TICKET_ID');
    err.statusCode = ERROR_STATUS.INVALID_TICKET_ID;
    throw err;
  }

  if (!userId || !signature) {
    const err = new Error('MISSING_REQUIRED_FIELDS');
    err.statusCode = ERROR_STATUS.MISSING_REQUIRED_FIELDS;
    throw err;
  }

  if (status !== 'VALID') {
    const err = new Error('TICKET_NOT_VALID');
    err.statusCode = ERROR_STATUS.TICKET_NOT_VALID;
    logger.error('[VERIFICATION SERVICE] Ticket non valide pour vérification', { ticketId: numericId, status });
    throw err;
  }

  logger.info(`[VERIFICATION SERVICE] Démarrage vérification pour ticket ${numericId}`);

  // 🔹 Mise en cache locale
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

  // 🔹 Appel réel au service /verify
  const verifiedTicket = await callVerifyTicket(numericId, signature, authHeader);

  return verifiedTicket;
}

module.exports = { startVerificationService };
