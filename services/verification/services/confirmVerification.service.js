// services/confirmVerificationService.js
const crypto = require('crypto');
const axios = require('axios');
const logger = require('../utils/logger');
const { publishKafkaEvent } = require('../utils/kafkaClient');
const { ERROR_STATUS } = require('../utils/httpErrorMap');

/**
 * Confirme la vérification d’un ticket (statut FINAL : USED)
 * @param {object} qrPayload - Payload complet du QR code
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

  // 🔹 Récupération invisibleKey utilisateur
  let invisibleKey;
  try {
    const res = await axios.get(`${process.env.USER_URL}/${ticketData.userId}`, {
      headers: authHeader ? { Authorization: authHeader } : {}
    });
    invisibleKey = res.data?.data?.invisibleKey;
  } catch (err) {
    logger.warn(`[VERIFICATION SERVICE] Impossible de récupérer invisibleKey: ${err.message}`, { ticketId: numericId });
  }
  if (!invisibleKey) {
    const err = new Error('USER_KEY_NOT_FOUND');
    err.statusCode = ERROR_STATUS.USER_KEY_NOT_FOUND;
    throw err;
  }

  // 🔹 Recalcul HMAC signature
  const payloadToSign = `${ticketData.secretKey}:${invisibleKey}`;
  const expectedSignature = crypto.createHmac('sha256', invisibleKey).update(payloadToSign).digest('hex');
  if (qrPayload.signature !== expectedSignature) {
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
      confirmedAt: new Date().toISOString()
    });
    logger.info(`[VERIFICATION SERVICE] Kafka event VerificationSucceeded publié pour ticket ${numericId}`);
  } catch (err) {
    logger.warn(`[VERIFICATION SERVICE] Kafka publish failed: ${err.message}`, { ticketId: numericId });
  }

  return { ticketId: numericId, status: 'USED' };
}

module.exports = { confirmVerificationService };
