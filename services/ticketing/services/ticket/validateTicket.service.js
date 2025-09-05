// services/ticket/validateTicket.service.js
const prisma = require('../../utils/prismaClient');
const logger = require('../../utils/logger');
const { publishKafkaEvent } = require('../../utils/kafkaClient');
const { ERROR_STATUS } = require('../../utils/httpErrorMap');

// ID du compte technique Payment (configurable via .env)
const PAYMENT_SERVICE_USER_ID = Number(process.env.PAYMENT_SERVICE_USER_ID || 0);

/**
 * Passe un ticket de RESERVED à VALID et publie un event Kafka
 * @param {number|string} ticketId - ID du ticket à valider
 * @param {number} callerUserId - ID de l'appelant (extrait du JWT)
 * @param {string} callerRole - Rôle de l'appelant (extrait du JWT)
 */
async function validateTicketService(ticketId, callerUserId, callerRole) {
  // Autoriser si rôle PAYMENT, ou si c'est le compte technique Payment (id défini en env, rôle AGENT)
  if (
    !(callerRole === 'PAYMENT' ||
      (callerRole === 'AGENT' && callerUserId === PAYMENT_SERVICE_USER_ID))
  ) {
    const err = new Error('FORBIDDEN');
    err.statusCode = ERROR_STATUS.FORBIDDEN;
    throw err;
  }

  const numericId = typeof ticketId === 'string' ? Number(ticketId) : ticketId;

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

  const updated = await prisma.ticket.update({
    where: { id: numericId },
    data: { status: 'VALID' }
  });

  logger.info(`[TICKET SERVICE] Ticket ${numericId} validated`);

  try {
    await publishKafkaEvent('ticketing', {
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
