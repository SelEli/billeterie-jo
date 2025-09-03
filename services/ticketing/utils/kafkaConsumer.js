const { getKafka } = require('./kafkaClient');
const logger = require('./logger');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function startUserConsumer() {
  const consumer = getKafka().consumer({ groupId: 'ticketing-users-group' });

  await consumer.connect();
  await consumer.subscribe({ topic: 'users', fromBeginning: true });

  logger.info('[Kafka][UserConsumer] Abonné au topic "users"');

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const event = JSON.parse(message.value.toString());
        logger.debug(`[Kafka][UserConsumer] Event reçu: ${JSON.stringify(event)}`);

        switch (event.type) {
          case 'UserCreated':
          case 'UserUpdated':
            await prisma.user.upsert({
              where: { id: event.userId },
              update: {
                email: event.email,
                firstName: event.firstName,
                lastName: event.lastName,
                role: event.role
              },
              create: {
                id: event.userId,
                email: event.email,
                hash: '',
                invisibleKey: event.invisibleKey || '',
                firstName: event.firstName,
                lastName: event.lastName,
                role: event.role
              }
            });
            logger.info(`[Kafka][UserConsumer] User ${event.userId} enregistré/mis à jour`);
            break;

          case 'UserDeleted':
            await prisma.user.delete({ where: { id: event.userId } });
            logger.info(`[Kafka][UserConsumer] User ${event.userId} supprimé`);
            break;

          default:
            logger.warn(`[Kafka][UserConsumer] Type d'événement inconnu: ${event.type}`);
        }
      } catch (err) {
        logger.error(`[Kafka][UserConsumer] Erreur traitement message: ${err.message}`);
      }
    }
  });
}

module.exports = { startUserConsumer };
