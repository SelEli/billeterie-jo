// adapters/index.js
const ticketAdapter = require('./ticket.adapter');
// Si tu as un adapter Kafka spécifique au service :
const kafkaAdapter = require('./kafka.adapter');

function createAdapters() {
  return {
    ticket: ticketAdapter,
    kafka: kafkaAdapter
  };
}

module.exports = { createAdapters };
