const axios = require('axios');
const { publishKafkaEvent } = require('../utils/kafkaClient');
const logger = require('../utils/logger');
const { ERROR_STATUS } = require('../utils/httpErrorMap');
const { getVerificationData, clearVerificationData } = require('../utils/verificationCache');

/**
 * Confirme la vérification d'un ticket après start
 * @param {string|number} ticketId
 * @param {string|null} authHeader
 * @param {boolean} isMock
 */
async function confirmVerificationService(ticketId, authHeader = null, isMock = false) {
  // 🔹 Log complet du payload reçu
  logger.info('[VERIFICATION SERVICE] Payload reçu', { ticketId, authHeader, isMock });

  const numericId = Number(ticketId);
  if (!numericId) {
    const err = new Error('INVALID_TICKET_ID');
    err.statusCode = ERROR_STATUS.INVALID_TICKET_ID;
    throw err;
  }

  logger.info(`[VERIFICATION SERVICE] Confirmation vérification pour ticket ${numericId} (mock=${isMock})`);

  // 🔹 Récupération du cache
  const verificationInfo = getVerificationData(numericId);
  const userId = verificationInfo?.userId ?? null;
  const signature = verificationInfo?.signature ?? null;
  const status = verificationInfo?.status ?? null;

  // 🔹 Préparation payload pour Ticket Service
  const url = `${process.env.TICKET_URL}/verify`;
  const body = { ticketId: numericId, userId, signature, status };
  const headers = authHeader ? { Authorization: authHeader } : {};

  logger.info('[VERIFICATION SERVICE] Préparation requête verify', { url, body, headers });

  try {
    const resp = await axios.post(url, body, { headers });

    logger.info('[VERIFICATION SERVICE] Réponse brute verify', {
      status: resp.status,
      data: resp.data,
      headers: resp.headers
    });

    const ticketStatus = resp.data?.data?.status || resp.data?.status;
    logger.info('[VERIFICATION SERVICE] Statut renvoyé par ticket-service', { ticketStatus });

    if (ticketStatus !== 'USED') {
      logger.error(`[VERIFICATION SERVICE] Ticket ${numericId} non validé côté ticket-service`, resp.data);
      const err = new Error('TICKET_NOT_VALIDATED');
      err.statusCode = ERROR_STATUS.TICKET_NOT_VALIDATED || 500;
      throw err;
    }

    logger.info(`[VERIFICATION SERVICE] Ticket ${numericId} validé avec succès`);
  } catch (err) {
    logger.error('[VERIFICATION SERVICE] Erreur Ticket Service', {
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

  // 🔹 Nettoyage cache
  clearVerificationData(numericId);

  // 🔹 Publication Kafka "succeeded"
  await publishKafkaEvent('ticket', {
    type: 'TicketVerified',
    ticketId: numericId,
    userId,
    signature,
    mode: isMock ? 'mock' : 'live',
    confirmedAt: new Date().toISOString(),
    status: 'USED'
  });

  return { ticketId: numericId, status: 'USED', userId };
}

module.exports = { confirmVerificationService };
