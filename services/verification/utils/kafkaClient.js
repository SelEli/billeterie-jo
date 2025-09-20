// utils/kafka.js
const { Kafka } = require('kafkajs');
const logger = require('./logger');

let producer;
let kafka;

async function initKafka() {
  try {
    kafka = new Kafka({
      clientId: process.env.SERVICE_NAME || 'verification-service',
      brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
      retry: {
        initialRetryTime: 3000,
        retries: 1000
      }
    });
    producer = kafka.producer();
    await producer.connect();
    logger.info(`[kafka][Verification] Producer connecté à ${process.env.KAFKA_BROKER}`);
  } catch (err) {
    logger.error(`[kafka][Verification] Échec connexion producer: ${err.message}`);
  }
}

function getKafka() {
  if (!kafka) throw new Error('Kafka non initialisé — appelez initKafka() avant');
  return kafka;
}

async function publishKafkaEvent(topic, message) {
  if (!producer) {
    logger.warn('[kafka][Verification] Producer non initialisé, tentative de reconnexion...');
    try {
      await initKafka();
    } catch (err) {
      logger.error(`[kafka][Verification] Impossible de publier: ${err.message}`);
      return;
    }
  }
  try {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }]
    });
    logger.info(`[kafka][Verification] Message envoyé sur ${topic}: ${JSON.stringify(message)}`);
  } catch (err) {
    logger.error(`[kafka][Verification] Erreur envoi sur ${topic}: ${err.message}`);
  }
}

async function startKafkaConsumer(groupId, topics, handler) {
  const consumer = getKafka().consumer({ groupId });

  consumer.connect()
    .then(async () => {
      for (const topic of topics) {
        try {
          await consumer.subscribe({ topic, fromBeginning: true });
          logger.info(`[Kafka][Verification][Consumer] Abonné au topic "${topic}"`);
        } catch (err) {
          logger.error(`[Kafka][Verification][Consumer] Erreur abonnement "${topic}": ${err.message}`);
        }
      }

      await consumer.run({
        eachMessage: async ({ topic, message }) => {
          try {
            const event = JSON.parse(message.value.toString());
            logger.debug(`[Kafka][Verification][Consumer] Event reçu sur ${topic}: ${JSON.stringify(event)}`);
            await handler(topic, event);
          } catch (err) {
            logger.error(`[Kafka][Verification][Consumer] Erreur traitement message: ${err.message}`);
          }
        }
      });
    })
    .catch(err => {
      logger.error(`[Kafka][Verification][Consumer] Erreur connexion: ${err.message}`);
    });
}

module.exports = { initKafka, getKafka, publishKafkaEvent, startKafkaConsumer };
