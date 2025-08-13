// src/index.js
const express = require('express');
const dotenv = require('dotenv');
const assignRequestId = require('../utils/requestId');
const logger = require('../utils/logger');
const { initKafka } = require('../utils/kafkaClient');
const { initRedis } = require('../utils/redisClient');
const { consumeKafka } = require('../controllers/kafkaConsumer');

dotenv.config();

const SERVICE = process.env.SERVICE_NAME || 'ticketing-service';
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(assignRequestId);

// Middleware de log par requête
app.use((req, res, next) => {
  logger.info({
    message: '📥 Requête entrante',
    service: SERVICE,
    method: req.method,
    path: req.path,
    requestId: req.requestId
  });
  next();
});

// Routes API
app.use('/api', require('../routes/health'));
app.use('/api', require('../routes/event.routes'));
app.use('/api', require('../routes/offer.routes'));
app.use('/api', require('../routes/ticket.routes')); // si existant

// Lancement du serveur
app.listen(PORT, async () => {
  logger.info({ message: `🚀 Service ${SERVICE} lancé sur le port ${PORT}` });
  console.log(`✅ [${SERVICE}] actif sur le port ${PORT}`);

  try {
    initRedis();
    await initKafka();
    await consumeKafka();
    logger.info('[startup] Kafka consumer started and Redis initialized');
  } catch (err) {
    logger.error(`[startup] Error initializing services: ${err.message}`);
  }
});

// Arrêt propre
async function shutdown(signal) {
  logger.warn(`🛑 Arrêt du service ${SERVICE} suite à ${signal}`);
  try {
    process.exit(0);
  } catch (err) {
    logger.error(`Erreur à l'arrêt : ${err.message}`);
    process.exit(1);
  }
}
process.once('SIGINT', () => shutdown('SIGINT'));
process.once('SIGTERM', () => shutdown('SIGTERM'));
