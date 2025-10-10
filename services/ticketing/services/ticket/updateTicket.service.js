const prisma = require('../../utils/prismaClient');
const logger = require('../../utils/logger');
const { publishKafkaEvent } = require('../../utils/kafkaClient');
const { ERROR_STATUS } = require('../../utils/httpErrorMap');
const { invalidateCachedTicket } = require('../../cache/ticket.cache');

async function updateTicketService(id, data) {
  const numericId = typeof id === 'string' ? Number(id) : id;

  logger.debug('[TICKET][UPDATE] Service appelé', { id, numericId, data });

  let ticket;
  try {
    logger.debug('[TICKET][UPDATE] Appel Prisma.update', {
      where: { id: numericId },
      data
    });

    ticket = await prisma.ticket.update({
      where: { id: numericId },
      data
    });

    logger.debug('[TICKET][UPDATE] Prisma a retourné', ticket);
  } catch (err) {
    logger.error('[TICKET][UPDATE] Prisma.update a levé une erreur', {
      id: numericId,
      data,
      error: err.message,
      stack: err.stack
    });
    const e = new Error('TICKET_NOT_FOUND');
    e.statusCode = ERROR_STATUS.TICKET_NOT_FOUND;
    throw e;
  }

  if (!ticket) {
    logger.error('[TICKET][UPDATE] Aucun ticket retourné par Prisma', {
      id: numericId,
      data
    });
    const e = new Error('TICKET_NOT_FOUND');
    e.statusCode = ERROR_STATUS.TICKET_NOT_FOUND;
    throw e;
  }

  logger.info('[TICKET][UPDATE] Ticket mis à jour', {
    id: ticket.id,
    status: ticket.status
  });

  // Invalidation cache
  try {
    await invalidateCachedTicket(numericId);
    logger.debug('[TICKET][UPDATE] Cache invalidé', { id: numericId });
  } catch (err) {
    logger.warn('[TICKET][UPDATE] Erreur lors de l’invalidation du cache', {
      id: numericId,
      error: err.message
    });
  }

  // Publication Kafka
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
    logger.debug('[TICKET][UPDATE] Kafka event publié', { ticketId: ticket.id });
  } catch (err) {
    logger.warn('[TICKET][UPDATE] Kafka publish skipped', {
      id: numericId,
      error: err.message
    });
  }

  return ticket;
}

module.exports = { updateTicketService };
