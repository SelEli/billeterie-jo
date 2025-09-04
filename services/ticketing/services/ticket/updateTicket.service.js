// services/ticket/updateTicket.service.js
const prisma = require('../../utils/prismaClient');
const logger = require('../../utils/logger');
const { publishKafkaEvent } = require('../../utils/kafkaClient');
const { ERROR_STATUS } = require('../../utils/httpErrorMap');

/**
 * Mise à jour d'un ticket et publication d'un event Kafka
 */
async function updateTicketService(id, data) {
  const numericId = typeof id === 'string' ? Number(id) : id;

  let ticket;
  try {
    ticket = await prisma.ticket.update({
      where: { id: numericId },
      data
    });
  } catch {
    const err = new Error('TICKET_NOT_FOUND');
    err.statusCode = ERROR_STATUS.TICKET_NOT_FOUND;
    throw err;
  }

  if (!ticket) {
    const err = new Error('TICKET_NOT_FOUND');
    err.statusCode = ERROR_STATUS.TICKET_NOT_FOUND;
    throw err;
  }

  logger.info(`[TICKET] Updated: ${ticket.id}`);

  try {
    await publishKafkaEvent('ticket', {
      type: 'TicketUpdated',
      ticketId: ticket.id,
      userId: ticket.userId,
      eventId: ticket.eventId,
      offerId: ticket.offerId,
      price: ticket.price,
      zone: ticket.zone,
      status: ticket.status
    });
    logger.debug('[TICKET][UPDATE] Kafka event published');
  } catch (err) {
    logger.warn(`[TICKET][UPDATE] Kafka publish skipped: ${err.message}`);
  }

  return ticket;
}

module.exports = { updateTicketService };
