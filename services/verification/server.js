require('dotenv').config();
const logger = require('./utils/logger');
const { initKafka } = require('./utils/kafkaClient');
const { initRedis } = require('./utils/redisClient'); // si besoin de Redis ici
const { startConsumer } = require('./utils/kafkaConsumer'); // écoute verification
const app = require('./app');

(async () => {
  try {
    // Redis (si nécessaire pour verification-service)
    await initRedis();
    logger.info('[VERIFICATION-SERVICE] ✅ Redis client initialized');

    // Kafka
    await initKafka();
    logger.info('[VERIFICATION-SERVICE] ✅ Kafka producer initialized');

    // Consumer Kafka
    await startConsumer();
    logger.info('[VERIFICATION-SERVICE] ✅ Kafka consumer (verification) started');

    // HTTP API
    const PORT = process.env.PORT || 3004;
    app.listen(PORT, () => {
      logger.info(`[VERIFICATION-SERVICE] 🚀 Service démarré sur port ${PORT}`);
    });

  } catch (err) {
    logger.error('[VERIFICATION-SERVICE] ❌ Erreur init services', {
      message: err.message,
      stack: err.stack
    });
    process.exit(1);
  }
})();
