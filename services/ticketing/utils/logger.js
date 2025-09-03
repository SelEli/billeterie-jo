// utils/logger.js
const winston = require('winston');
const path = require('path');
const fs = require('fs');
const os = require('os');

const env = process.env.NODE_ENV || 'development';
const isProd = env === 'production';
const serviceName = process.env.SERVICE_NAME || 'service-unknown';
const logLevel = process.env.LOG_LEVEL || (isProd ? 'warn' : 'debug');

// 📁 Crée le dossier logs si absent (prod)
if (isProd) {
  const logsDir = path.join(__dirname, '..', 'logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
}

// 📦 Formats
const devFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const extras = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] ${level}: ${message}${extras}`;
  })
);

const prodFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// 🚀 Logger
const logger = winston.createLogger({
  level: logLevel,
  format: isProd ? prodFormat : devFormat,
  defaultMeta: {
    service: serviceName,
    env,
    pid: process.pid,
    hostname: os.hostname()
  },
  transports: [
    new winston.transports.Console(),
    ...(isProd
      ? [
          new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
          new winston.transports.File({ filename: 'logs/combined.log' })
        ]
      : [])
  ],
  exitOnError: false
});

// 🌟 Mode DEBUG forcé si LOG_LEVEL=debug
if (logLevel === 'debug') {
  logger.debug(`[LOGGER INIT] Mode debug activé pour ${serviceName} (${env})`);
}

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
