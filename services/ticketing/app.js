const express = require('express');
const bodyParser = require('body-parser');
const ticketRoutes = require('./routes/ticket.routes');
const { authMiddleware } = require('./middlewares/auth.middleware');

// ⏯️ Init Redis
const { initRedis } = require('./utils/redisClient');
initRedis();

// 🔌 Init Kafka (si tu l’utilises dans services/kafkaClient.js par exemple)
const { connectKafkaProducer } = require('./services/ticketing/kafka/kafkaClient');
connectKafkaProducer();

const app = express();
app.use(bodyParser.json());
app.use(authMiddleware);

// 🔀 Routes
app.use('/ticketing/ticket', ticketRoutes);

// 🚨 Middleware d’erreur générique
app.use((err, req, res, next) => {
  console.error('[APP ERROR]', err);
  res.status(500).json({ message: 'Internal server error.' });
});

module.exports = app;
