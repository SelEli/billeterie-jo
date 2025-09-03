// services/verification/verifyTicket.service.js
const prisma = require('../../utils/prismaClient');
const logger = require('../../utils/logger');
const { publishKafkaEvent } = require('../../utils/kafkaClient');
const { ERROR_STATUS } = require('../../utils/httpErrorMap');

async function verifyTicketService({ signature }) {
  if (!signature || typeof signature !== 'string') {
    const err = new Error('MISSING_REQUIRED_FIELDS');
    err.statusCode = ERROR_STATUS.MISSING_REQUIRED_FIELDS;
    throw err;
  }

  const ticket = await prisma.ticket.findUnique({
    where: { signature },
    include: { event: true }
  });

  if (!ticket) {
    const err = new Error('TICKET_NOT_FOUND');
    err.statusCode = ERROR_STATUS.TICKET_NOT_FOUND;
    throw err;
  }

  if (ticket.status !== 'VALID') {
    const err = new Error('TICKET_NOT_VALID');
    err.statusCode = ERROR_STATUS.TICKET_NOT_VALID;
    throw err;
  }

  if (ticket.event && ticket.event.date < new Date()) {
    const err = new Error('EVENT_EXPIRED');
    err.statusCode = ERROR_STATUS.EVENT_EXPIRED;
    throw err;
  }

  // Marquer le ticket comme utilisé
  const updated = await prisma.ticket.update({
    where: { id: ticket.id },
    data: { status: 'USED' }
  });

  logger.info(`[TICKET] Used (verified on entry): ${updated.id}`);

  try {
    await publishKafkaEvent('ticketing', {
      type: 'TicketUsed',
      ticketId: updated.id,
      userId: updated.userId,
      eventId: updated.eventId,
      status: updated.status
    });
  } catch (err) {
    logger.warn(`[TICKET][VERIFY] Kafka publish skipped: ${err.message}`);
  }

  return updated;
}

module.exports = { verifyTicketService };
