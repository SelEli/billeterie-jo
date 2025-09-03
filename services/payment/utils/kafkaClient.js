// payment-service/utils/kafkaClient.js
const { Kafka } = require('kafkajs');

let producer;

async function initKafka() {
  const kafka = new Kafka({
    clientId: process.env.SERVICE_NAME || 'payment-service',
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
  });

  producer = kafka.producer();
  await producer.connect();
  return kafka;
}

async function publishKafkaEvent(topic, message) {
  if (!producer) throw new Error('Kafka producer non initialisé');
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }]
  });
}

module.exports = { initKafka, publishKafkaEvent };
