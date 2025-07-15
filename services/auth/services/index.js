const { createLogger, format, transports } = require('winston');
const { randomBytes } = require('crypto');
const kafka = require('./kafka'); // ← ne doit PAS se connecter ici

const publishKafkaEvent = async (topic, payload) => {
  const producer = kafka.producer();
  await producer.connect();

  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(payload) }]
  });

  await producer.disconnect();
};

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => `[${timestamp}] ${level}: ${message}`)
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/user.log' })
  ]
});

const generateInvisibleKey = () => randomBytes(32).toString('hex');

module.exports = {
  logger,
  publishKafkaEvent,
  generateInvisibleKey
};
