const prisma = require('../../utils/prismaClient');
const logger = require('../../utils/logger');
const { publishKafkaEvent } = require('../../utils/kafkaClient');
const { ERROR_STATUS } = require('../../utils/httpErrorMap');

/**
 * Suppression d'un ticket et publication d'un event Kafka
 */
async function deleteTicketService(id) {
  const numericId = typeof id === 'string' ? Number(id) : id;

  let deleted;
  try {
    deleted = await prisma.ticket.delete({ where: { id: numericId } });
  } catch {
    const err = new Error('TICKET_NOT_FOUND');
    err.statusCode = ERROR_STATUS.TICKET_NOT_FOUND;
    throw err;
  }

  if (!deleted) {
    const err = new Error('TICKET_NOT_FOUND');
    err.statusCode = ERROR_STATUS.TICKET_NOT_FOUND;
    throw err;
  }

  logger.info(`[TICKET] Deleted: ${deleted.id}`);

  // Kafka non bloquant
  try {
    await publishKafkaEvent('ticket', {
      type: 'TicketDeleted',
      ticketId: deleted.id,
      userId: deleted.userId,
      eventId: deleted.eventId,
      offerId: deleted.offerId,
      price: deleted.price,
      zone: deleted.zone,
      status: deleted.status
    });
    logger.debug('[TICKET][DELETE] Kafka event published');
  } catch (err) {
    logger.warn(`[TICKET][DELETE] Kafka publish skipped: ${err.message}`);
  }

  return deleted;
}

module.exports = { deleteTicketService };
