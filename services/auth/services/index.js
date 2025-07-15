const { Kafka } = require('kafkajs');
const { createLogger, format, transports } = require('winston');
const { randomBytes } = require('crypto');

const kafka = new Kafka({ clientId: 'user-service', brokers: ['localhost:9092'] });
const producer = kafka.producer();

producer.connect();

const publishKafkaEvent = async (topic, payload) => {
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(payload) }]
  });
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
  publishKafkaEvent,
  logger,
  generateInvisibleKey
};
