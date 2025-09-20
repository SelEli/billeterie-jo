const ticketAdapter = require('./ticket.adapter');
const kafkaAdapter = require('./kafka.adapter');

function createAdapters() {
  return {
    ticket: ticketAdapter,
    kafka: kafkaAdapter
  };
}

module.exports = { createAdapters };
