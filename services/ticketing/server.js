// 📦 Charger les variables d'environnement uniquement en dev
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: '.env.development' });
}

const logger = require('./utils/logger');
const { initKafka } = require('./utils/kafkaClient');
const { initRedis } = require('./utils/redisClient');
const { startConsumer } = require('./utils/kafkaConsumer'); // écoute user + ticket

// --- Config avec valeurs par défaut ---
const PORT = process.env.PORT || 3002;
const HOST = process.env.HOST || '0.0.0.0';
const REDIS_HOST = process.env.REDIS_HOST || 'redis';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379', 10);
const KAFKA_BROKERS = (process.env.KAFKA_BROKERS || 'kafka:9092').split(',');
const KAFKA_CLIENT_ID = process.env.KAFKA_CLIENT_ID || 'ticketing-service';

(async () => {
  try {
    // Redis
    await initRedis({ host: REDIS_HOST, port: REDIS_PORT });
    logger.info(`✅ Redis connecté à ${REDIS_HOST}:${REDIS_PORT}`);

    // Kafka
    await initKafka({ brokers: KAFKA_BROKERS, clientId: KAFKA_CLIENT_ID });
    logger.info(`✅ Kafka connecté à ${KAFKA_BROKERS.join(', ')}`);

    // Consumers Kafka
    await startConsumer();
    logger.info('✅ Kafka consumers (user + ticket) démarrés');

    // HTTP API
    const app = require('./app');
    app.listen(PORT, HOST, () => {
      logger.info(`✅ Ticketing service listening on http://${HOST}:${PORT}`);
    });

  } catch (err) {
    logger.error('❌ Échec lors de l’initialisation des services', {
      message: err.message,
      stack: err.stack
    });
    process.exit(1);
  }
})();
