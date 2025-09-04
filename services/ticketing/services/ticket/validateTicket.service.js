// services/ticket/validateTicket.service.js
const prisma = require('../../utils/prismaClient');
const logger = require('../../utils/logger');
const { publishKafkaEvent } = require('../../utils/kafkaClient');
const { ERROR_STATUS } = require('../../utils/httpErrorMap');

/**
 * Passe un ticket de RESERVED à VALID et publie un event Kafka
 */
async function validateTicketService(ticketId) {
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

module.exports = { validateTicketService };
