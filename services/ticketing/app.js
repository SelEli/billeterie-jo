const express = require('express');
const morgan = require('morgan'); // 🧾 Logger HTTP
const ticketRoutes = require('./routes/ticket.routes');

// 📦 Initialisation Redis (sauf en test)
const { initRedis } = require('./utils/redisClient');
if (!process.env.JEST_WORKER_ID) {
  initRedis();
}

// 📦 Initialisation Kafka (sauf en test)
// ⚠️ Import depuis utils/kafkaClient.js et appeler initKafka()
const { initKafka } = require('./utils/kafkaClient');
if (!process.env.JEST_WORKER_ID) {
  initKafka().catch(err => {
    console.error('Failed to connect Kafka producer:', err);
    process.exit(1); // ou gérer l'erreur selon ta politique
  });
}

const app = express();
app.use(express.json());

// 🧾 Logger HTTP
app.use(morgan('dev'));

// 🔀 Routes principales
app.use('/ticketing/ticket', ticketRoutes);

// 🩺 Healthcheck
app.get('/health', (req, res) => res.status(200).send('OK'));

// 🚨 Middleware global d’erreur
app.use((err, req, res, next) => {
  console.error('[APP ERROR]', err);
  const code = err.statusCode || 500;
  res.status(code).json({
    message: err.message || 'Internal server error.',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
});

module.exports = app;
