const { kafka } = require('../utils/kafkaClient');

const consumeKafka = async () => {
  const consumer = kafka.consumer({ groupId: 'default-group' });
  await consumer.connect();
  await consumer.subscribe({ topic: 'billet-achat', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`[Kafka] Message reçu sur ${topic} : `, message.value.toString());
    }
  });
};

module.exports = { consumeKafka };