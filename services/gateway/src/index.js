const express = require('express');
const dotenv = require('dotenv');
const assignRequestId = require('../utils/requestId');
const logger = require('../utils/logger');

dotenv.config();

const app = express();
app.use(express.json());
app.use(assignRequestId);

// Middleware de log par requête
app.use((req, res, next) => {
  logger.info({
    message: '📥 Requête entrante',
    service: 'gateway',
    method: req.method,
    path: req.path,
    requestId: req.requestId
  });
  next();
});

// Route /api/health
app.use('/api', require('../routes/health'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info({ message: `🚀 Service gateway lancé sur le port ${PORT}` });
  console.log(`✅ [gateway] actif sur le port ${PORT}`);
});