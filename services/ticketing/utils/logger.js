const winston = require('winston');

const env = process.env.NODE_ENV || 'development';
const isProd = env === 'production';
const serviceName = process.env.SERVICE_NAME || 'service-unknown';

// 🔹 Niveau dynamique
const logLevel = process.env.LOG_LEVEL || (isProd ? 'warn' : 'info');

const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    isProd
      ? winston.format.json()
      : winston.format.colorize({ all: true }),
    isProd
      ? winston.format.printf(({ timestamp, level, message, ...meta }) => {
          return JSON.stringify({
            timestamp,
            level,
            message,
            service: serviceName,
            env,
            ...meta
          });
        })
      : winston.format.printf(({ timestamp, level, message }) => {
          return `[${timestamp}] ${level}: ${message}`;
        })
  ),
  defaultMeta: { service: serviceName, env },
  transports: [
    new winston.transports.Console(),
    ...(isProd
      ? [new winston.transports.File({ filename: 'logs/error.log', level: 'error' })]
      : [])
  ]
});

module.exports = logger;
