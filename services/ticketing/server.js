// 🌱 Charge les variables d'environnement depuis .env
require('dotenv').config();

const logger = require('./utils/logger');

// 🏗️ App Express principale
const app = require('./app');

// 🚀 Initialisation des services externes
const { initKafka } = require('./utils/kafkaClient');
const { initRedis } = require('./utils/redisClient');

(async () => {
  try {
    // ⚡ Initialisation Redis
    await initRedis();
    logger.info('✅ Redis client initialized');

    // ⚡ Initialisation Kafka
    await initKafka();
    logger.info('✅ Kafka producer initialized');

    // 🔊 Lancement du serveur
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      logger.info(`✅ Ticketing service listening on port ${PORT}`);
    });

  } catch (err) {
    logger.error('❌ Échec lors de l’initialisation des services', {
      message: err.message,
      stack: err.stack
    });
    process.exit(1); // ⛔ Arrêt propre en cas d’erreur
  }
})();
