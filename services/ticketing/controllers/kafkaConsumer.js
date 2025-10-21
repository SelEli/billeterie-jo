// controllers/kafkaConsumer.js
const { kafka } = require('../utils/kafkaClient');
const logger = require('../utils/logger');
const { timer } = require('../monitor/monitor');

const { cacheEvent, invalidateEventCache } = require('../cache/event.cache');
const { cacheOffer, invalidateOfferCache } = require('../cache/offer.cache');

const GROUP_ID = process.env.SERVICE_NAME
  ? `${process.env.SERVICE_NAME}-consumer`
  : 'ticketing-service-consumer';

const TOPICS = [
  'event.created',
  'event.updated',
  'event.deleted',
  'offer.created',
  'offer.updated',
  'offer.deleted'
];

let consumer;

async function consumeKafka() {
  consumer = kafka.consumer({ groupId: GROUP_ID });

  const t = timer('kafkaConsumer.connect').start();
  try {
    await consumer.connect();
    t.success();
    logger.info(`[kafka] Consumer connected with groupId=${GROUP_ID}`);
  } catch (err) {
    t.fail(err);
    logger.error(`[kafka] Consumer connection failed: ${err.message}`);
    throw err;
  }

  for (const topic of TOPICS) {
    try {
      await consumer.subscribe({ topic, fromBeginning: false });
      logger.info(`[kafka] Subscribed to topic: ${topic}`);
    } catch (err) {
      logger.error(`[kafka] Failed to subscribe to ${topic}: ${err.message}`);
    }
  }

  await consumer.run({
    autoCommit: true,
    eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
      const tMsg = timer(`kafkaConsumer.msg:${topic}`).start();
      try {
        const value = message.value ? message.value.toString() : '';
        const payload = value ? JSON.parse(value) : null;

        logger.info(`[kafka] ${topic}@${partition} payload=${value}`);

        switch (topic) {
          case 'event.created':
          case 'event.updated':
            await cacheEvent(payload);
            break;
          case 'event.deleted':
            await invalidateEventCache(payload.id);
            break;
          case 'offer.created':
          case 'offer.updated':
            await cacheOffer(payload);
            break;
          case 'offer.deleted':
            await invalidateOfferCache(payload.id);
            break;
          default:
            logger.warn(`[kafka] Unhandled topic: ${topic}`);
        }

        tMsg.success();
        await heartbeat();
      } catch (err) {
        tMsg.fail(err);
        logger.error(`[kafka] Error processing message on ${topic}: ${err.message}`);
        pause();
        setTimeout(() => consumer.resume([{ topic }]), 1000);
      }
    }
  });

  const shutdown = async (signal) => {
    try {
      logger.info(`[kafka] Shutting down consumer due to ${signal}...`);
      await consumer.disconnect();
      logger.info('[kafka] Consumer disconnected.');
      process.exit(0);
    } catch (err) {
      logger.error(`[kafka] Error on shutdown: ${err.message}`);
      process.exit(1);
    }
  };

  process.once('SIGINT', () => shutdown('SIGINT'));
  process.once('SIGTERM', () => shutdown('SIGTERM'));
}

module.exports = { consumeKafka };
