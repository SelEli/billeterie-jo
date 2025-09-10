const { startKafkaConsumer } = require('./kafkaClient');
const logger = require('./logger');
const { createAdapters } = require('../adapters');

const { kafka: kafkaAdapter } = createAdapters();

async function startConsumer() {
  await startKafkaConsumer(
    'payment-service-group', // groupId unique pour ce service
    ['payment'],             // écoute uniquement le topic payment
    async (topic, event) => {
      if (topic === 'payment') {
        await handlePaymentRequest(event);
      }
    }
  );
}

async function handlePaymentRequest(event) {
  try {
    if (event.type === 'PaymentRequested') {
      logger.info(`[Payment] Demande reçue pour ticket ${event.ticketId}, montant ${event.amount}`);

      // 🔹 Ici, ta logique réelle de paiement
      // Exemple : appel API banque, vérification solde, etc.
      const ok = true; // ou false selon le résultat

      // 🔹 Publication du résultat sur le topic "ticket"
      await kafkaAdapter.publishTicketEvent('ticket', {
        type: ok ? 'PaymentSucceeded' : 'PaymentFailed',
        ticketId: event.ticketId,
        amount: event.amount
      });

      logger.info(`[Payment] Ticket ${event.ticketId} → ${ok ? 'PaymentSucceeded' : 'PaymentFailed'}`);
    } else {
      logger.warn(`[Payment] Type d'événement inconnu: ${event.type}`);
    }
  } catch (err) {
    logger.error(`[Payment] Erreur traitement: ${err.message}`);
  }
}

module.exports = { startConsumer };
