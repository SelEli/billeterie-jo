require('dotenv').config();
const logger = require('./utils/logger');
const { initKafka } = require('./utils/kafkaClient');
const { initRedis } = require('./utils/redisClient');
const { startConsumer } = require('./utils/kafkaConsumer'); // écoute payment + verification
const app = require('./app');

(async () => {
  try {
    // Redis (si nécessaire pour payment-service)
    await initRedis();
    logger.info('[PAYMENT-SERVICE] ✅ Redis client initialized');

    // Kafka
    await initKafka();              
    logger.info('[PAYMENT-SERVICE] ✅ Kafka producer initialized');

    // Consumers Kafka
    await startConsumer();   
    logger.info('[PAYMENT-SERVICE] ✅ Kafka consumers (payment + verification) started');

    // HTTP API
    const PORT = process.env.PORT || 3003;
    app.listen(PORT, () => {
      logger.info(`[PAYMENT-SERVICE] 🚀 Service démarré sur port ${PORT}`);
    });

  } catch (err) {
    logger.error('[PAYMENT-SERVICE] ❌ Erreur init services', {
      message: err.message,
      stack: err.stack
    });
    process.exit(1);
  }
})();
