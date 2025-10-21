// utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: process.env.SERVICE_NAME || 'service-unknown' },
  transports: [new winston.transports.Console()]
});

/**
 * Formate un résumé compact de la requête pour les logs.
 * Inclut méthode, URL et ID de requête si présent.
 */
logger.formatLogContext = (req) => {
  if (!req) return '';
  const id = req.id || req.requestId || '-';
  return `${req.method} ${req.originalUrl} [id=${id}]`;
};

module.exports = logger;
