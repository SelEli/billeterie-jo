// 📦 Charger les variables d'environnement uniquement en dev
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: '.env.development' });
}

const logger = require('./utils/logger');
const { initKafka } = require('./utils/kafkaClient');
const { initRedis } = require('./utils/redisClient');
const { startConsumer } = require('./utils/kafkaConsumer');
const app = require('./app');

// --- Config avec valeurs par défaut ---
const PORT = process.env.PORT || 3003;
const HOST = process.env.HOST || '0.0.0.0';
const REDIS_HOST = process.env.REDIS_HOST || 'redis';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379', 10);
const KAFKA_BROKERS = (process.env.KAFKA_BROKERS || 'kafka:9092').split(',');
const KAFKA_CLIENT_ID = process.env.KAFKA_CLIENT_ID || 'payment-service';

(async () => {
  try {
    // Redis
    await initRedis({ host: REDIS_HOST, port: REDIS_PORT });
    logger.info(`[PAYMENT-SERVICE] ✅ Redis connecté à ${REDIS_HOST}:${REDIS_PORT}`);

    // Kafka
    await initKafka({ brokers: KAFKA_BROKERS, clientId: KAFKA_CLIENT_ID });
    logger.info(`[PAYMENT-SERVICE] ✅ Kafka connecté à ${KAFKA_BROKERS.join(', ')}`);

    // Consumers Kafka
    await startConsumer();
    logger.info('[PAYMENT-SERVICE] ✅ Kafka consumers (payment + verification) démarrés');

    // HTTP API
    app.listen(PORT, HOST, () => {
      logger.info(`[PAYMENT-SERVICE] 🚀 Service démarré sur http://${HOST}:${PORT}`);
    });

  } catch (err) {
    logger.error('[PAYMENT-SERVICE] ❌ Erreur init services', {
      message: err.message,
      stack: err.stack
    });
    process.exit(1);
  }
})();
