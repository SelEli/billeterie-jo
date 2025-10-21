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