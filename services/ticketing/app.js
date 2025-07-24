const express = require('express');
const morgan = require('morgan'); // 🧾 Logger HTTP
const ticketRoutes = require('./routes/ticket.routes');

// 📦 Initialisation Redis
const { initRedis } = require('./utils/redisClient');
initRedis();

// 📦 Initialisation Kafka
const { connectKafkaProducer } = require('./services/ticketing/kafka/kafkaClient');
connectKafkaProducer();

const app = express();
app.use(express.json());

// 🧾 Middleware morgan pour log des requêtes HTTP
app.use(morgan('dev')); // Format : method, URL, status, time

// 🔀 Routes principales
app.use('/ticketing/ticket', ticketRoutes);

// 🩺 Healthcheck
app.get('/health', (req, res) => res.status(200).send('OK'));

// 🚨 Middleware générique d’erreur
app.use((err, req, res, next) => {
  console.error('[APP ERROR]', err);
  const code = err.statusCode || 500;
  res.status(code).json({
    message: err.message || 'Internal server error.',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
});

module.exports = app;
