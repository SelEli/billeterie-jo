const crypto = require('crypto');
const prisma = require('../../utils/prismaClient');
const logger = require('../../utils/logger');
const axios = require('axios');
const { publishKafkaEvent } = require('../../utils/kafkaClient');
const { ERROR_STATUS } = require('../../utils/httpErrorMap');
const { invalidateCachedTicket } = require('../../cache/ticket.cache');

async function validateTicketService(ticketId, authHeader) {
  logger.info('[TICKET SERVICE] Ticket validation called', { ticketId });

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

  if (ticket.status !== 'RESERVED') {
    const err = new Error('INVALID_TICKET_STATUS');
    err.statusCode = ERROR_STATUS.INVALID_TICKET_STATUS;
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

  // 🔹 Signature calculée uniquement avec les deux clés
  const payloadToSign = `${ticket.secretKey}:${invisibleKey}`;
  const signature = crypto.createHmac('sha256', invisibleKey).update(payloadToSign).digest('hex');

  // 🔹 Mise à jour ticket
  const updated = await prisma.ticket.update({
    where: { id: numericId },
    data: { status: 'VALID', signature }
  });

  await invalidateCachedTicket(numericId);

  // 🔹 Publication Kafka
  try {
    await publishKafkaEvent('ticket', {
      type: 'TicketValidated',
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

module.exports = { validateTicketService };
