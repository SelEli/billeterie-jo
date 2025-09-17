const crypto = require('crypto');
const prisma = require('../../utils/prismaClient');
const logger = require('../../utils/logger');
const axios = require('axios');
const { publishKafkaEvent } = require('../../utils/kafkaClient');
const { ERROR_STATUS } = require('../../utils/httpErrorMap');
const { invalidateCachedTicket } = require('../../cache/ticket.cache');

const PAYMENT_SERVICE_USER_ID = Number(process.env.PAYMENT_SERVICE_USER_ID || 0);

async function validateTicketService(ticketId, callerUserId, callerRole, authHeader) {
  // 🔹 Log maximal au début
  logger.info('[TICKET SERVICE] Ticket validation called', {
    ticketId,
    callerUserId: Number(callerUserId),
    callerRole,
    expectedPaymentUserId: PAYMENT_SERVICE_USER_ID,
    authHeader
  });

  if (!(callerRole === 'PAYMENT' || (callerRole === 'AGENT' && callerUserId === PAYMENT_SERVICE_USER_ID))) {
    logger.error('[TICKET SERVICE] Forbidden access', {
      callerUserId,
      callerRole,
      expectedPaymentUserId: PAYMENT_SERVICE_USER_ID
    });
    const err = new Error('FORBIDDEN');
    err.statusCode = ERROR_STATUS.FORBIDDEN;
    throw err;
  }

  const numericId = typeof ticketId === 'string' ? Number(ticketId) : ticketId;

  // 🔹 Log avant requête DB
  logger.debug('[TICKET SERVICE] Recherche ticket dans DB', { ticketId: numericId });

  const ticket = await prisma.ticket.findUnique({ where: { id: numericId } });
  if (!ticket) {
    logger.error('[TICKET SERVICE] Ticket non trouvé', { ticketId: numericId });
    const err = new Error('TICKET_NOT_FOUND');
    err.statusCode = ERROR_STATUS.TICKET_NOT_FOUND;
    throw err;
  }

  if (ticket.status !== 'RESERVED') {
    logger.error('[TICKET SERVICE] Ticket status invalide', { ticketId: numericId, status: ticket.status });
    const err = new Error('INVALID_TICKET_STATUS');
    err.statusCode = ERROR_STATUS.INVALID_TICKET_STATUS;
    throw err;
  }

  let invisibleKey;
  try {
    const res = await axios.get(`${process.env.USER_URL}/${ticket.userId}`, {
      headers: { Authorization: authHeader }
    });
    invisibleKey = res.data?.data?.invisibleKey;
    logger.debug('[TICKET SERVICE] Invisible key récupérée', { ticketId: numericId, invisibleKey });
  } catch (err) {
    logger.warn(`[TICKET SERVICE] Impossible de récupérer invisibleKey: ${err.message}`, { ticketId: numericId });
  }

  if (!invisibleKey) {
    logger.error('[TICKET SERVICE] InvisibleKey manquante', { ticketId: numericId, userId: ticket.userId });
    const err = new Error('USER_KEY_NOT_FOUND');
    err.statusCode = ERROR_STATUS.USER_KEY_NOT_FOUND;
    throw err;
  }

  const payloadToSign = `${ticket.secretKey}:${invisibleKey}:${ticket.id}:${ticket.eventId}:${ticket.userId}:${ticket.zone}:${ticket.price}:${ticket.updatedAt.toISOString()}`;
  const signature = crypto.createHmac('sha256', invisibleKey).update(payloadToSign).digest('hex');

  const updated = await prisma.ticket.update({
    where: { id: numericId },
    data: { status: 'VALID', signature }
  });

  await invalidateCachedTicket(numericId);

  logger.info(`[TICKET SERVICE] Ticket ${numericId} validated & signed`, { signature });

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
    logger.warn(`[TICKET SERVICE] Kafka publish failed: ${err.message}`, { ticketId: numericId });
  }

  return updated;
}

module.exports = { validateTicketService, PAYMENT_SERVICE_USER_ID };
