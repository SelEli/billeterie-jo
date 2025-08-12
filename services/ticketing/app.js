// app.js
const express = require('express');
const morgan = require('morgan');

const ticketRoutes = require('./routes/ticket.routes');
const authenticate = require('./middlewares/auth.middleware');

const { initRedis } = require('./utils/redisClient');
const { initKafka } = require('./utils/kafkaClient');

if (!process.env.JEST_WORKER_ID) {
  initRedis();
  initKafka().catch(err => {
    console.error('❌ Failed to connect Kafka producer:', err);
    process.exit(1);
  });
}

const app = express();

app.use(express.json());
app.use(morgan('dev'));

// 🔹 Log toutes les requêtes entrantes pour debug tests
app.use((req, res, next) => {
  console.log('➡️ [REQUEST]', req.method, req.originalUrl, {
    headers: req.headers,
    body: req.body
  });
  next();
});

// 🔹 Tes routes appliquent authenticate elles-mêmes
app.use('/ticketing/ticket', ticketRoutes);

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
