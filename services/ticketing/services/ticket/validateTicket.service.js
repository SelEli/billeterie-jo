const crypto = require('crypto');
const prisma = require('../../utils/prismaClient');
const logger = require('../../utils/logger');
const axios = require('axios');
const { publishKafkaEvent } = require('../../utils/kafkaClient');
const { ERROR_STATUS } = require('../../utils/httpErrorMap');
const { invalidateCachedTicket } = require('../../cache/ticket.cache');

const PAYMENT_SERVICE_USER_ID = Number(process.env.PAYMENT_SERVICE_USER_ID || 0);

async function validateTicketService(ticketId, callerUserId, callerRole, authHeader) {
  // Autorisation
  if (
    !(callerRole === 'PAYMENT' ||
      (callerRole === 'AGENT' && callerUserId === PAYMENT_SERVICE_USER_ID))
  ) {
    const err = new Error('FORBIDDEN');
    err.statusCode = ERROR_STATUS.FORBIDDEN;
    throw err;
  }

  const numericId = typeof ticketId === 'string' ? Number(ticketId) : ticketId;

  // Lecture ticket
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

  // Récupération invisibleKey depuis Auth
  let invisibleKey;
  try {
    const res = await axios.get(`${process.env.USER_URL}/${ticket.userId}`, {
      headers: { Authorization: authHeader }
    });
    invisibleKey = res.data?.data?.invisibleKey;
  } catch (err) {
    logger.warn(`[TICKET SERVICE] Impossible de récupérer invisibleKey: ${err.message}`);
  }
  if (!invisibleKey) {
    const err = new Error('USER_KEY_NOT_FOUND');
    err.statusCode = ERROR_STATUS.USER_KEY_NOT_FOUND;
    throw err;
  }

  // Calcul de la signature
  const payloadToSign = `${ticket.secretKey}:${invisibleKey}:${ticket.id}:${ticket.eventId}:${ticket.userId}:${ticket.zone}:${ticket.price}:${ticket.updatedAt.toISOString()}`;
  const signature = crypto
    .createHmac('sha256', invisibleKey)
    .update(payloadToSign)
    .digest('hex');

  // Passage en VALID + enregistrement signature
  const updated = await prisma.ticket.update({
    where: { id: numericId },
    data: { status: 'VALID', signature }
  });

  // Invalidation cache
  await invalidateCachedTicket(numericId);

  logger.info(`[TICKET SERVICE] Ticket ${numericId} validated & signed`);

  // Publication Kafka
  try {
    await publishKafkaEvent('ticket', {
      type: 'TicketValidated',
      ticketId: updated.id,
      userId: updated.userId,
      eventId: updated.eventId,
      offerId: updated.offerId,
      status: updated.status
    });
    logger.debug(`[TICKET SERVICE] Kafka event TicketValidated published for ticket ${numericId}`);
  } catch (err) {
    logger.warn(`[TICKET SERVICE] Kafka publish failed: ${err.message}`);
  }

  return updated;
}

module.exports = { validateTicketService, PAYMENT_SERVICE_USER_ID };
