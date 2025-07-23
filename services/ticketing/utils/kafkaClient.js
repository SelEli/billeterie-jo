const { Kafka } = require('kafkajs');
let producer;

async function initKafka() {
  const kafka = new Kafka({ brokers: [process.env.KAFKA_BROKER] });
  producer = kafka.producer();
  await producer.connect();
}

function publishKafkaEvent(topic, message) {
  if (!producer) throw new Error('Kafka producer not initialized');
  return producer.send({ topic, messages: [{ value: JSON.stringify(message) }] });
}

module.exports = { initKafka, publishKafkaEvent };
