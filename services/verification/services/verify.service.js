// services/verify.service.js
const crypto = require('crypto');
const axios = require('axios');
const logger = require('../utils/logger');
const { ERROR_STATUS } = require('../utils/httpErrorMap');

/**
 * Vérifie la signature d'un ticket à partir du qrPayload
 * et demande au service ticket de le passer en USED si OK.
 */
async function verifyService(qrPayload, authHeader) {
  const {
    ticketId,
    eventId,
    userId,
    zone,
    price,
    issuedAt,
    signature
  } = qrPayload;

  // 1️⃣ Charger le ticket depuis le service ticket
  let ticket;
  try {
    const res = await axios.get(`${process.env.TICKET_URL}/${ticketId}`, {
      headers: { Authorization: authHeader }
    });
    ticket = res.data?.data;
  } catch (err) {
    logger.warn(`[VERIFY SERVICE] Ticket fetch failed: ${err.message}`);
    const e = new Error('TICKET_NOT_FOUND');
    e.statusCode = ERROR_STATUS.TICKET_NOT_FOUND;
    throw e;
  }

  if (!ticket || ticket.status !== 'VALID') {
    const e = new Error('TICKET_NOT_VALID');
    e.statusCode = ERROR_STATUS.TICKET_NOT_VALID;
    throw e;
  }

  // 2️⃣ Récupérer invisibleKey depuis Auth
  let invisibleKey;
  try {
    const res = await axios.get(`${process.env.USER_URL}/${ticket.userId}`, {
      headers: { Authorization: authHeader }
    });
    invisibleKey = res.data?.data?.invisibleKey;
  } catch (err) {
    logger.warn(`[VERIFY SERVICE] Impossible de récupérer invisibleKey: ${err.message}`);
  }
  if (!invisibleKey) {
    const e = new Error('USER_KEY_NOT_FOUND');
    e.statusCode = ERROR_STATUS.USER_KEY_NOT_FOUND;
    throw e;
  }

  // 3️⃣ Recalculer la signature attendue
  const payloadToSign = `${ticket.secretKey}:${invisibleKey}:${ticket.id}:${ticket.eventId}:${ticket.userId}:${ticket.zone}:${ticket.price}:${ticket.updatedAt}`;
  const expectedSignature = crypto
    .createHmac('sha256', invisibleKey)
    .update(payloadToSign)
    .digest('hex');

  if (signature !== expectedSignature) {
    const e = new Error('INVALID_SIGNATURE');
    e.statusCode = ERROR_STATUS.INVALID_SIGNATURE;
    throw e;
  }

  // 4️⃣ Appeler le service ticket pour passer en USED
  let updatedTicket;
  try {
    const res = await axios.patch(
      `${process.env.TICKET_URL}/${ticketId}/use`,
      {},
      { headers: { Authorization: authHeader } }
    );
    updatedTicket = res.data?.data;
  } catch (err) {
    logger.warn(`[VERIFY SERVICE] Ticket update failed: ${err.message}`);
    const e = new Error('TICKET_UPDATE_FAILED');
    e.statusCode = ERROR_STATUS.INTERNAL_SERVER_ERROR;
    throw e;
  }

  logger.info(`[VERIFY SERVICE] Ticket ${ticketId} vérifié et marqué USED`);
  return updatedTicket;
}

module.exports = { verifyService };
