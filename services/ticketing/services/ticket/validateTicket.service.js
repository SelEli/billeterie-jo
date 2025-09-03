// services/ticket/validateTicket.service.js
const prisma = require('../../utils/prismaClient');
const logger = require('../../utils/logger');
const crypto = require('crypto');
const { publishKafkaEvent } = require('../../utils/kafkaClient');
const { ERROR_STATUS } = require('../../utils/httpErrorMap');

async function validateTicketService(ticketId) {
  const id = Number(ticketId);
  if (Number.isNaN(id)) {
    const err = new Error('INVALID_TICKET_ID');
    err.statusCode = ERROR_STATUS.INVALID_TICKET_ID;
    throw err;
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: { user: { select: { invisibleKey: true } }, event: true }
  });

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

  if (ticket.event && ticket.event.date < new Date()) {
    const err = new Error('EVENT_EXPIRED');
    err.statusCode = ERROR_STATUS.EVENT_EXPIRED;
    throw err;
  }

  const signature = crypto
    .createHmac('sha256', ticket.user.invisibleKey)
    .update(ticket.secretKey)
    .digest('hex');

  const updated = await prisma.ticket.update({
    where: { id },
    data: { signature, status: 'VALID' }
  });

  logger.info(`[TICKET] Validated: ${updated.id}`);

  try {
    await publishKafkaEvent('ticketing', {
      type: 'TicketValidated',
      ticketId: updated.id,
      userId: updated.userId,
      eventId: updated.eventId,
      status: updated.status,
      signature: updated.signature
    });
  } catch (err) {
    logger.warn(`[TICKET][VALIDATE] Kafka publish skipped: ${err.message}`);
  }

  return updated;
}

module.exports = { validateTicketService };
