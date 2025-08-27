require('dotenv').config();
const express = require('express');
const logger = require('./utils/logger');
const authMiddleware = require('./middlewares/auth.middleware');

const app = express();

// Middleware global JSON
app.use(express.json());

// Middleware de log par requête
app.use((req, res, next) => {
  logger.info({
    message: '📥 Requête entrante',
    service: process.env.SERVICE_NAME || 'gateway',
    method: req.method,
    path: req.path,
    requestId: req.id || req.requestId
  });
  next();
});

// Routes publiques
app.use('/', require('./routes/health'));
app.use('/auth', require('./routes/auth'));

// Routes protégées par JWT
app.use('/tickets', authMiddleware, require('./routes/tickets'));
app.use('/payment', authMiddleware, require('./routes/payment'));
app.use('/verification', authMiddleware, require('./routes/verification'));

// Gestion des 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

module.exports = app;
