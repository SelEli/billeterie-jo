const axios = require('axios');
const logger = require('../utils/logger');
const { publishKafkaEvent } = require('../utils/kafkaClient');
const { ERROR_STATUS } = require('../utils/httpErrorMap');

/**
 * Confirme la vérification d’un ticket (statut FINAL : USED)
 * @param {object} qrPayload - Payload complet du QR code (inclut signature)
 * @param {string|null} authHeader
 */
async function confirmVerificationService(qrPayload, authHeader = null) {
  const ticketIdRaw = qrPayload?.ticketId;
  const numericId = Number(ticketIdRaw);
  if (!numericId) {
    const err = new Error('INVALID_TICKET_ID');
    err.statusCode = ERROR_STATUS.INVALID_TICKET_ID;
    throw err;
  }

  logger.info(`[VERIFICATION SERVICE] Confirmation pour ticket ${numericId}`, { qrPayload });

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

  const ticketData = ticketResp.data?.data;
  if (!ticketData || !ticketData.secretKey || !ticketData.userId) {
    logger.error('[VERIFICATION SERVICE] Ticket-service returned invalid data', ticketResp.data);
    throw new Error('INVALID_TICKET_DATA');
  }

  // 🔹 Vérification signature côté ticketing (comparaison directe)
  if (qrPayload.signature !== ticketData.signature) {
    const err = new Error('INVALID_SIGNATURE');
    err.statusCode = ERROR_STATUS.INVALID_SIGNATURE;
    throw err;
  }

  // 🔹 Update ticket status USED
  try {
    await axios.post(`${process.env.TICKET_URL}/verify`, { ticketId: numericId }, {
      headers: authHeader ? { Authorization: authHeader } : {}
    });
    logger.info(`[VERIFICATION SERVICE] Ticket ${numericId} passé en USED`);
  } catch (err) {
    logger.error('[VERIFICATION SERVICE] Erreur Ticket Service (POST /verify)', {
      ticketId: numericId,
      message: err.message,
      stack: err.stack,
      config: err.config
    });
    throw err;
  }

  // 🔹 Publication Kafka
  try {
    await publishKafkaEvent('ticket', {
      type: 'VerificationSucceeded',
      ticketId: numericId,
      confirmedAt: new Date().toISOString(),
      userId: ticketData.userId,
      eventId: ticketData.eventId,
      offerId: ticketData.offerId,
      zone: ticketData.zone,
      price: ticketData.price,
      issuedAt: ticketData.issuedAt,
      signature: ticketData.signature
    });
    logger.info(`[VERIFICATION SERVICE] Kafka event VerificationSucceeded publié pour ticket ${numericId}`);
  } catch (err) {
    logger.warn(`[VERIFICATION SERVICE] Kafka publish failed: ${err.message}`, { ticketId: numericId });
  }

  // 🔹 Retour complet pour front
  return {
    ticketId: numericId,
    userId: ticketData.userId,
    eventId: ticketData.eventId,
    offerId: ticketData.offerId,
    zone: ticketData.zone,
    price: ticketData.price,
    issuedAt: ticketData.issuedAt,
    status: 'USED',
    signature: ticketData.signature
  };
}

module.exports = { confirmVerificationService };
