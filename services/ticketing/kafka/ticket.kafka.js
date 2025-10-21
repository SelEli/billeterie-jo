const { publishKafkaEvent } = require('../utils/kafkaClient');
const logger = require('../utils/logger');

async function emitTicketCreated(ticket) {
  try {
    await publishKafkaEvent('ticket.created', ticket);
  } catch (err) {
    logger.error(`Failed to emit ticket.created event: ${err.message}`);
    throw err;
  }
}

async function emitTicketUpdated(ticket) {
  try {
    await publishKafkaEvent('ticket.updated', ticket);
  } catch (err) {
    logger.error(`Failed to emit ticket.updated event: ${err.message}`);
    throw err;
  }
}

async function emitTicketDeleted(ticketId) {
  try {
    await publishKafkaEvent('ticket.deleted', { id: ticketId });
  } catch (err) {
    logger.error(`Failed to emit ticket.deleted event: ${err.message}`);
    throw err;
  }
}

module.exports = {
  emitTicketCreated,
  emitTicketUpdated,
  emitTicketDeleted,
};
