// kafka/event.kafka.js
const { publishKafkaEvent } = require('../utils/kafkaClient');
const logger = require('../utils/logger');

async function emitEventCreated(event) {
  try {
    await publishKafkaEvent('event.created', event);
    logger.info(`[kafka] event.created emitted for ID ${event.id}`);
  } catch (err) {
    logger.error(`[kafka] Failed to emit event.created: ${err.message}`);
    throw err;
  }
}

async function emitEventUpdated(event) {
  try {
    await publishKafkaEvent('event.updated', event);
    logger.info(`[kafka] event.updated emitted for ID ${event.id}`);
  } catch (err) {
    logger.error(`[kafka] Failed to emit event.updated: ${err.message}`);
    throw err;
  }
}

async function emitEventDeleted(eventId) {
  try {
    await publishKafkaEvent('event.deleted', { id: eventId });
    logger.info(`[kafka] event.deleted emitted for ID ${eventId}`);
  } catch (err) {
    logger.error(`[kafka] Failed to emit event.deleted: ${err.message}`);
    throw err;
  }
}

module.exports = {
  emitEventCreated,
  emitEventUpdated,
  emitEventDeleted
};
