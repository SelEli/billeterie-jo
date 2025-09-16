// 📦 Charger les variables d'environnement uniquement en dev
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: '.env.development' });
}

const logger = require('./utils/logger');
const { initKafka } = require('./utils/kafkaClient');
const { initRedis } = require('./utils/redisClient'); // si besoin de Redis ici
const { startConsumer } = require('./utils/kafkaConsumer'); // écoute verification
const app = require('./app');

// --- Config avec valeurs par défaut ---
const PORT = process.env.PORT || 3004;
const HOST = process.env.HOST || '0.0.0.0';
const REDIS_HOST = process.env.REDIS_HOST || 'redis';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379', 10);
const KAFKA_BROKERS = (process.env.KAFKA_BROKERS || 'kafka:9092').split(',');
const KAFKA_CLIENT_ID = process.env.KAFKA_CLIENT_ID || 'verification-service';

(async () => {
  try {
    // Redis (si nécessaire pour verification-service)
    await initRedis({ host: REDIS_HOST, port: REDIS_PORT });
    logger.info(`[VERIFICATION-SERVICE] ✅ Redis connecté à ${REDIS_HOST}:${REDIS_PORT}`);

    // Kafka
    await initKafka({ brokers: KAFKA_BROKERS, clientId: KAFKA_CLIENT_ID });
    logger.info(`[VERIFICATION-SERVICE] ✅ Kafka connecté à ${KAFKA_BROKERS.join(', ')}`);

    // Consumer Kafka
    await startConsumer();
    logger.info('[VERIFICATION-SERVICE] ✅ Kafka consumer (verification) démarré');

    // HTTP API
    app.listen(PORT, HOST, () => {
      logger.info(`[VERIFICATION-SERVICE] 🚀 Service démarré sur http://${HOST}:${PORT}`);
    });

  } catch (err) {
    logger.error('[VERIFICATION-SERVICE] ❌ Erreur init services', {
      message: err.message,
      stack: err.stack
    });
    process.exit(1);
  }
})();
