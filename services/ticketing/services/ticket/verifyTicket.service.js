const crypto = require('crypto');
const prisma = require('../../utils/prismaClient');
const axios = require('axios');
const logger = require('../../utils/logger');
const { publishKafkaEvent } = require('../../utils/kafkaClient');
const { ERROR_STATUS } = require('../../utils/httpErrorMap');
const { invalidateCachedTicket } = require('../../cache/ticket.cache');

/**
 * Vérifie un ticket VALID en comparant sa signature QR et le passe en USED
 * @param {object} qrPayload – payload QR reçu (doit contenir ticketId + signature)
 * @param {string|null} authHeader
 */
async function verifyTicketService(qrPayload, authHeader) {
  const { ticketId, signature } = qrPayload;
  const numericId = Number(ticketId);

  if (!numericId) throw Object.assign(new Error('INVALID_TICKET_ID'), { statusCode: ERROR_STATUS.INVALID_TICKET_ID });

  logger.info('[TICKET SERVICE] Vérification ticket appelée', { ticketId: numericId });

  const ticket = await prisma.ticket.findUnique({ where: { id: numericId } });
  if (!ticket) throw Object.assign(new Error('TICKET_NOT_FOUND'), { statusCode: ERROR_STATUS.TICKET_NOT_FOUND });
  if (ticket.status !== 'VALID') throw Object.assign(new Error('TICKET_NOT_VALID'), { statusCode: ERROR_STATUS.TICKET_NOT_VALID });

  // 🔹 Récupération de la clé invisible utilisateur
  let invisibleKey;
  try {
    const res = await axios.get(`${process.env.USER_URL}/${ticket.userId}`, {
      headers: authHeader ? { Authorization: authHeader } : {}
    });
    invisibleKey = res.data?.data?.invisibleKey;
  } catch (err) {
    logger.warn(`[TICKET SERVICE] Impossible de récupérer invisibleKey: ${err.message}`, { ticketId: numericId });
  }

  if (!invisibleKey) throw Object.assign(new Error('USER_KEY_NOT_FOUND'), { statusCode: ERROR_STATUS.USER_KEY_NOT_FOUND });

  // 🔹 Recalcul de la signature côté serveur
  const payloadToSign = `${ticket.secretKey}:${invisibleKey}`;
  const expectedSignature = crypto.createHmac('sha256', invisibleKey).update(payloadToSign).digest('hex');

  logger.info('[DEBUG] Vérification signature', { ticketId: numericId, expectedSignature, receivedSignature: signature });

  if (signature !== expectedSignature) throw Object.assign(new Error('INVALID_SIGNATURE'), { statusCode: ERROR_STATUS.INVALID_SIGNATURE });

  // 🔹 Tout est OK → mise à jour en USED
  const updated = await prisma.ticket.update({ where: { id: numericId }, data: { status: 'USED' } });
  await invalidateCachedTicket(numericId);

  // 🔹 Publication Kafka
  try {
    await publishKafkaEvent('ticket', {
      type: 'TicketVerified',
      ticketId: numericId,
      verifiedAt: new Date().toISOString(),
      status: 'USED'
    });
    logger.info('[TICKET SERVICE] Kafka event TicketVerified publié', { ticketId: numericId });
  } catch (err) {
    logger.warn(`[TICKET SERVICE] Kafka publish failed: ${err.message}`, { ticketId: numericId });
  }

  return updated;
}

module.exports = { verifyTicketService };
