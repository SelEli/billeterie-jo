const crypto = require('crypto');
const prisma = require('../../utils/prismaClient');
const axios = require('axios');
const logger = require('../../utils/logger');
const { publishKafkaEvent } = require('../../utils/kafkaClient');
const { ERROR_STATUS } = require('../../utils/httpErrorMap');
const { invalidateCachedTicket } = require('../../cache/ticket.cache');

async function verifyTicketService(qrPayload, authHeader) {
  const { ticketId, signature } = qrPayload;

  const numericId = Number(ticketId);
  if (!numericId) {
    const err = new Error('INVALID_TICKET_ID');
    err.statusCode = ERROR_STATUS.INVALID_TICKET_ID;
    throw err;
  }

  const ticket = await prisma.ticket.findUnique({ where: { id: numericId } });
  if (!ticket) {
    const err = new Error('TICKET_NOT_FOUND');
    err.statusCode = ERROR_STATUS.TICKET_NOT_FOUND;
    throw err;
  }

  if (['USED', 'EXPIRED'].includes(ticket.status)) {
    return ticket; // déjà utilisé ou expiré
  }

  if (ticket.status !== 'VALID') {
    const err = new Error('TICKET_NOT_VALID');
    err.statusCode = ERROR_STATUS.TICKET_NOT_VALID;
    throw err;
  }

  // 🔹 Récupération de la clé utilisateur
  let invisibleKey;
  try {
    const res = await axios.get(`${process.env.USER_URL}/${ticket.userId}`, {
      headers: authHeader ? { Authorization: authHeader } : {}
    });
    invisibleKey = res.data?.data?.invisibleKey;
  } catch (err) {
    logger.warn(`[TICKET SERVICE] Impossible de récupérer invisibleKey: ${err.message}`, { ticketId });
  }

  if (!invisibleKey) {
    const err = new Error('USER_KEY_NOT_FOUND');
    err.statusCode = ERROR_STATUS.USER_KEY_NOT_FOUND;
    throw err;
  }

  // 🔹 Recalcul de la signature uniquement avec les deux clés
  const payloadToSign = `${ticket.secretKey}:${invisibleKey}`;
  const expectedSignature = crypto.createHmac('sha256', invisibleKey).update(payloadToSign).digest('hex');

  if (signature !== expectedSignature) {
    const err = new Error('INVALID_SIGNATURE');
    err.statusCode = ERROR_STATUS.INVALID_SIGNATURE;
    throw err;
  }

  // 🔹 Tout est OK → marquer USED
  const updated = await prisma.ticket.update({
    where: { id: numericId },
    data: { status: 'USED' }
  });

  await invalidateCachedTicket(numericId);

  // 🔹 Publication Kafka
  try {
    await publishKafkaEvent('ticket', {
      type: 'TicketVerified',
      ticketId: updated.id,
      userId: updated.userId,
      eventId: updated.eventId,
      offerId: updated.offerId,
      status: updated.status
    });
  } catch (err) {
    logger.warn(`[TICKET SERVICE] Kafka publish failed: ${err.message}`, { ticketId: numericId });
  }

  return updated;
}

module.exports = { verifyTicketService };
