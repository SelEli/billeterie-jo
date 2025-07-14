const fs = require('fs');
const path = require('path');

const services = ['paiement', 'verification', 'ticketing'];

const kafkaClientContent = `
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: process.env.SERVICE_NAME || 'service',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});

module.exports = { kafka };
`.trim();

const kafkaConsumerStub = `
const { kafka } = require('../utils/kafkaClient');

const consumeKafka = async () => {
  const consumer = kafka.consumer({ groupId: 'default-group' });
  await consumer.connect();
  await consumer.subscribe({ topic: 'billet-achat', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(\`[Kafka] Message reçu sur \${topic} : \`, message.value.toString());
    }
  });
};

module.exports = { consumeKafka };
`.trim();

const kafkaRouteStub = `
const express = require('express');
const router = express.Router();
const { kafka } = require('../utils/kafkaClient');

router.post('/test', async (req, res) => {
  const producer = kafka.producer();
  await producer.connect();

  await producer.send({
    topic: 'billet-achat',
    messages: [{ value: JSON.stringify({ test: true, timestamp: Date.now() }) }]
  });

  await producer.disconnect();
  res.status(200).json({ message: 'Message Kafka envoyé.' });
});

module.exports = router;
`.trim();

for (const service of services) {
  const basePath = path.join(__dirname, 'services', service);

  // utils/kafkaClient.js
  const utilsPath = path.join(basePath, 'utils');
  fs.mkdirSync(utilsPath, { recursive: true });
  const kafkaClientPath = path.join(utilsPath, 'kafkaClient.js');
  if (!fs.existsSync(kafkaClientPath)) {
    fs.writeFileSync(kafkaClientPath, kafkaClientContent);
    console.log(`✅ kafkaClient.js créé pour ${service}`);
  }

  // controllers/kafkaConsumer.js
  const ctrlPath = path.join(basePath, 'controllers');
  fs.mkdirSync(ctrlPath, { recursive: true });
  const consumerPath = path.join(ctrlPath, 'kafkaConsumer.js');
  if (!fs.existsSync(consumerPath)) {
    fs.writeFileSync(consumerPath, kafkaConsumerStub);
    console.log(`✅ kafkaConsumer.js créé pour ${service}`);
  }

  // routes/kafkaTest.js
  const routePath = path.join(basePath, 'routes');
  fs.mkdirSync(routePath, { recursive: true });
  const routeFile = path.join(routePath, 'kafkaTest.js');
  if (!fs.existsSync(routeFile)) {
    fs.writeFileSync(routeFile, kafkaRouteStub);
    console.log(`✅ Route /kafka/test créée pour ${service}`);
  }

  // .env.example
  const envPath = path.join(basePath, '.env.example');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    if (!envContent.includes('KAFKA_BROKER')) {
      fs.appendFileSync(envPath, '\nKAFKA_BROKER=localhost:9092\n');
      console.log(`📄 KAFKA_BROKER ajouté à .env.example de ${service}`);
    }
  }
}

console.log('\nKafka setup complet injecté dans tous les services.');
