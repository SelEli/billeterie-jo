const { publishKafkaEvent } = require('../utils/kafka.client');

function emitTicketCreated(ticket) {
  return publishKafkaEvent('ticket.created', ticket);
}

function emitTicketUpdated(ticket) {
  return publishKafkaEvent('ticket.updated', ticket);
}

module.exports = { emitTicketCreated, emitTicketUpdated };
