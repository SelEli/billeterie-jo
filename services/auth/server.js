// 📦 Charger les variables d'environnement uniquement en dev
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: '.env.development' });
}

const { logger, initKafka, initRedis } = require('./utils');
const app = require('./app');

// --- Config avec valeurs par défaut ---
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';
const REDIS_HOST = process.env.REDIS_HOST || 'redis';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379', 10);
const KAFKA_BROKERS = (process.env.KAFKA_BROKERS || 'kafka:9092').split(',');
const KAFKA_CLIENT_ID = process.env.KAFKA_CLIENT_ID || 'app-service';

(async () => {
  try {
    await initRedis({ host: REDIS_HOST, port: REDIS_PORT });
    await initKafka({ brokers: KAFKA_BROKERS, clientId: KAFKA_CLIENT_ID });

    app.listen(PORT, HOST, () => {
      // 🔒 Log de sécurité unique
      logger.info(
        `✅ Application initialisée : Redis@${REDIS_HOST}:${REDIS_PORT}, Kafka@${KAFKA_BROKERS.join(', ')}, serveur http://${HOST}:${PORT}`
      );
    });

  } catch (err) {
    logger.error('❌ Échec lors de l’initialisation des services', {
      message: err.message,
      stack: err.stack
    });
    process.exit(1);
  }
})();
