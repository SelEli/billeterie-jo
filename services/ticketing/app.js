const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('./utils/logger');

const ticketRoutes = require('./routes/ticket.routes');
const eventRoutes  = require('./routes/event.routes');
const offerRoutes  = require('./routes/offer.routes');

const { initRedis } = require('./utils/redisClient');
const { initKafka } = require('./utils/kafkaClient');

const app = express();

// Initialisations externes hors test
if (!process.env.JEST_WORKER_ID) {
  logger.info('[INIT] Initialisation Redis & Kafka...');
  initRedis();
  initKafka()
    .then(() => logger.info('[INIT] Kafka connecté'))
    .catch(err => {
      logger.error(`[INIT][ERR] Kafka non connecté: ${err.message}`);
      process.exit(1);
    });
}

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// 🔹 Log compact toutes requêtes entrantes (désactivable via LOG_LEVEL)
app.use((req, res, next) => {
  logger.debug(
    `[REQ] ${req.method} ${req.originalUrl} | params=${JSON.stringify(req.params)} | query=${JSON.stringify(req.query)} | body=${JSON.stringify(req.body)}`
  );
  next();
});

// 🔹 Mount des routes
app.use('/ticketing/tickets', ticketRoutes);
app.use('/ticketing/events',  eventRoutes);
app.use('/ticketing/offers',  offerRoutes);

// 🔹 Healthcheck
app.get('/health', (req, res) => {
  logger.info('[HEALTH] 💓 OK');
  res.status(200).send('OK');
});

// 🔹 Gestion globale des erreurs
app.use((err, req, res, next) => {
  logger.error(`[APP ERROR] ${err.message}`, { stack: err.stack });
  const code = err.statusCode || 500;
  res.status(code).json({
    status: 'error',
    data: null,
    errors: [err.message || 'Internal server error.'],
    meta: {}
  });
});

module.exports = app;
