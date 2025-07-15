// services/kafka.js
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: process.env.SERVICE_NAME || 'gateway-service',
  brokers: [process.env.KAFKA_BROKER],
});

module.exports = kafka;
