require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const {
  logger,
  requestId,
  formatLogContext
} = require('./utils');
const { success, error } = require('./utils/response');

const mainRoutes = require('./routes');

const app = express();

// 🌍 Middlewares globaux
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(
  morgan(
    process.env.MORGAN_FORMAT ||
      (process.env.NODE_ENV === 'production' ? 'combined' : 'dev')
  )
);

// 🆔 ID unique pour chaque requête
app.use(requestId);

// 🪵 Logger compact global
app.use((req, res, next) => {
  logger.debug(`[APP][REQ] ${formatLogContext(req)}`);
  next();
});

// 🚏 Montage des routes agrégées
app.use('/', mainRoutes);

// 🚫 404 — non trouvé
app.use((req, res) => {
  logger.warn(`[APP][404] Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json(error(['Route not found.']));
});

// 🛑 Gestion globale des erreurs
app.use((err, req, res, next) => {
  logger.error(`[APP][ERROR] ${err.message}`, { stack: err.stack });
  const code = err.statusCode || 500;
  res.status(code).json(
    error([err.message || 'Internal server error.'])
  );
});

module.exports = app;
