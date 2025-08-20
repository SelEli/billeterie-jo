require('dotenv').config();

const { logger, initKafka, initRedis } = require('./utils');
const app = require('./app');

(async () => {
  try {
    await initRedis();
    logger.info('✅ Redis client initialized');

    await initKafka();
    logger.info('✅ Kafka producer initialized');

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      logger.info(`🚀 Server ready at http://localhost:${PORT}`);
    });

  } catch (err) {
    logger.error('❌ Échec lors de l’initialisation des services', {
      message: err.message,
      stack: err.stack
    });
    process.exit(1);
  }
})();
