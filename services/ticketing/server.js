require('dotenv').config();
const logger = require('./utils/logger');
const { initKafka } = require('./utils/kafkaClient');
const { initRedis } = require('./utils/redisClient');
const { startUserConsumer } = require('./utils/kafkaConsumer');

(async () => {
  try {
    await initRedis();
    logger.info('✅ Redis client initialized');

    await initKafka();
    logger.info('✅ Kafka producer initialized');

    await startUserConsumer();
    logger.info('✅ Kafka user consumer started');

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
