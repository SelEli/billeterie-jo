require('dotenv').config();
const logger = require('./utils/logger');
const { initKafka } = require('./utils/kafkaClient');
const { initRedis } = require('./utils/redisClient');
const { startConsumer } = require('./utils/kafkaConsumer'); // écoute user + ticket

(async () => {
  try {
    // Redis
    await initRedis();
    logger.info('✅ Redis client initialized');

    // Kafka
    await initKafka();
    logger.info('✅ Kafka producer initialized');

    // Consumers Kafka
    await startConsumer();
    logger.info('✅ Kafka consumers (user + ticket) started');

    // HTTP API
    const app = require('./app');
    const PORT = process.env.PORT || 3002;
    app.listen(PORT, () => {
      logger.info(`✅ Ticketing service listening on port ${PORT}`);
    });

  } catch (err) {
    logger.error('❌ Échec lors de l’initialisation des services', {
      message: err.message,
      stack: err.stack
    });
    process.exit(1);
  }
})();
