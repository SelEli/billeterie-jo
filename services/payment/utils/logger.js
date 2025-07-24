const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: process.env.SERVICE_NAME || 'service-unknown' },
  transports: [new winston.transports.Console()]
});

module.exports = logger;