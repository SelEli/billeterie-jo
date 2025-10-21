// kafka/offer.kafka.js
const { publishKafkaEvent } = require('../utils/kafkaClient');
const logger = require('../utils/logger');

async function emitOfferCreated(offer) {
  try {
    await publishKafkaEvent('offer.created', offer);
    logger.info(`[kafka] offer.created emitted for ID ${offer.id}`);
  } catch (err) {
    logger.error(`[kafka] Failed to emit offer.created: ${err.message}`);
    throw err;
  }
}

async function emitOfferUpdated(offer) {
  try {
    await publishKafkaEvent('offer.updated', offer);
    logger.info(`[kafka] offer.updated emitted for ID ${offer.id}`);
  } catch (err) {
    logger.error(`[kafka] Failed to emit offer.updated: ${err.message}`);
    throw err;
  }
}

async function emitOfferDeleted(offerId) {
  try {
    await publishKafkaEvent('offer.deleted', { id: offerId });
    logger.info(`[kafka] offer.deleted emitted for ID ${offerId}`);
  } catch (err) {
    logger.error(`[kafka] Failed to emit offer.deleted: ${err.message}`);
    throw err;
  }
}

module.exports = {
  emitOfferCreated,
  emitOfferUpdated,
  emitOfferDeleted
};
