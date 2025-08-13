// app.js
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const ticketRoutes = require('./routes/ticket.routes');
const eventRoutes  = require('./routes/event.routes');
const offerRoutes  = require('./routes/offer.routes');

const { initRedis } = require('./utils/redisClient');
const { initKafka } = require('./utils/kafkaClient');

// Initialisations externes désactivées en environnement de test
if (!process.env.JEST_WORKER_ID) {
  initRedis();
  initKafka().catch(err => {
    console.error('❌ Failed to connect Kafka producer:', err);
    process.exit(1);
  });
}

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// 🔹 Log toutes les requêtes entrantes pour debug
app.use((req, res, next) => {
  console.log('➡️ [REQUEST]', req.method, req.originalUrl, {
    headers: req.headers,
    body: req.body
  });
  next();
});

// 🔹 Mount des routes par ressource (uniformisé sous /ticketing)
app.use('/ticketing/tickets', ticketRoutes);
app.use('/ticketing/events',  eventRoutes);
app.use('/ticketing/offers',  offerRoutes);

app.get('/health', (req, res) => {
  console.log('💓 [HEALTHCHECK]');
  res.status(200).send('OK');
});

// 🔹 Middleware global gestion erreurs
app.use((err, req, res, next) => {
  console.error('❌ [APP ERROR]', err);
  const code = err.statusCode || 500;
  res.status(code).json({
    status: 'error',
    data: null,
    errors: [err.message || 'Internal server error.'],
    meta: {}
  });
});

module.exports = app;
