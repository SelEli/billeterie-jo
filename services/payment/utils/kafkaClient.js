const { Kafka } = require('kafkajs');
const logger = require('./logger');

let producer;
let kafka;

/**
 * Initialise la connexion Kafka et le producer
 */
async function initKafka() {
  try {
    kafka = new Kafka({
      clientId: process.env.SERVICE_NAME || 'payment-service',
      brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
    });
    producer = kafka.producer();
    await producer.connect();
    logger.info(`[kafka] Producer connecté à ${process.env.KAFKA_BROKER}`);
  } catch (err) {
    logger.error(`[kafka] Échec connexion producer: ${err.message}`);
    throw err;
  }
}

/**
 * Retourne l'instance Kafka
 */
function getKafka() {
  if (!kafka) {
    throw new Error('Kafka non initialisé — appelez initKafka() avant');
  }
  return kafka;
}

/**
 * Publie un message sur un topic Kafka
 * @param {string} topic
 * @param {object} message
 */
async function publishKafkaEvent(topic, message) {
  if (!producer) throw new Error('Kafka producer not initialized');
  try {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }]
    });
    logger.info(`[kafka] Message envoyé sur ${topic}: ${JSON.stringify(message)}`);
  } catch (err) {
    logger.error(`[kafka] Erreur envoi sur ${topic}: ${err.message}`);
    throw err;
  }
}

module.exports = { initKafka, getKafka, publishKafkaEvent };
