const { getKafka } = require('./kafkaClient');
const logger = require('./logger');
const { confirmPaymentService } = require('../services/confirmPayment.service');

/**
 * Démarre le consumer Kafka pour traiter les demandes de paiement
 */
async function startPaymentConsumer() {
  const consumer = getKafka().consumer({ groupId: 'payment-service-group' });

  await consumer.connect();
  await consumer.subscribe({ topic: 'payment', fromBeginning: true });

  logger.info('[Kafka][PaymentConsumer] Abonné au topic "payment"');

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const event = JSON.parse(message.value.toString());
        logger.debug(`[Kafka][PaymentConsumer] Event reçu: ${JSON.stringify(event)}`);

        switch (event.type) {
          case 'PaymentRequested':
            logger.info(`[Kafka][PaymentConsumer] Traitement PaymentRequested pour ticket ${event.ticketId}`);
            await confirmPaymentService(
              event.ticketId,
              event.amount,
              (process.env.USE_MOCK_PAYMENT || '').toLowerCase() === 'true'
            );
            break;

          default:
            logger.warn(`[Kafka][PaymentConsumer] Type d'événement inconnu: ${event.type}`);
        }
      } catch (err) {
        logger.error(`[Kafka][PaymentConsumer] Erreur traitement message: ${err.message}`);
      }
    }
  });
}

module.exports = { startPaymentConsumer };
