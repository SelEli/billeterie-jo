// adapters/kafka.adapter.js
// 📣 Adapter Kafka
// - mode: 'mock' | 'live'
// - live: délègue au client Kafka réel si disponible via utils/kafkaClient
// - mock: no-op + log
//
// Note: Dans tes tests E2E tu peux surcharger KAFKA_MODE=mock pour éviter les effets réseau.

const logger = require('../utils/logger');

let realKafkaClient;
try {
  // Optionnel: importe le client réel si ton projet en expose un
  realKafkaClient = require('../utils/kafkaClient');
} catch {
  realKafkaClient = null;
}

module.exports = function createKafkaAdapter({ mode = 'live' } = {}) {
  async function publishTicketEvent(topic, payload) {
    if (mode === 'mock') {
      logger.debug(`[KAFKA ADAPTER] Mock publish → topic=${topic}`, payload);
      return { status: 'mocked', topic };
    }

    if (!realKafkaClient || typeof realKafkaClient.publishKafkaEvent !== 'function') {
      logger.warn('[KAFKA ADAPTER] Client Kafka indisponible, fallback mock');
      return { status: 'mocked-fallback', topic };
    }

    try {
      await realKafkaClient.publishKafkaEvent(topic, payload);
      logger.info(`[KAFKA ADAPTER] Published → topic=${topic}`);
      return { status: 'success', topic };
    } catch (err) {
      logger.warn(`[KAFKA ADAPTER] Publish failed: ${err.message}`);
      return { status: 'failed', error: err.message, topic };
    }
  }

  return { publishTicketEvent };
};
