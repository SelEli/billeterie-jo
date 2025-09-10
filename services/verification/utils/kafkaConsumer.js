const { startKafkaConsumer } = require('./kafkaClient');
const logger = require('./logger');
const { createAdapters } = require('../adapters');

const { kafka: kafkaAdapter } = createAdapters();

async function startConsumer() {
  await startKafkaConsumer(
    'verification-service-group', // groupId unique pour ce service
    ['verification'],             // écoute uniquement le topic verification
    async (topic, event) => {
      if (topic === 'verification') {
        await handleVerificationRequest(event);
      }
    }
  );
}

async function handleVerificationRequest(event) {
  try {
    if (event.type === 'TicketCheckRequested') {
      logger.info(`[Verification] Demande reçue pour ticket ${event.ticketId}`);

      // 🔹 Ici, ta logique réelle de vérification
      // Exemple : appel à une API, lecture en base, contrôle anti-fraude, etc.
      const ok = true; // ou false selon le résultat du contrôle

      // 🔹 Publication du résultat sur le topic "ticket"
      await kafkaAdapter.publishTicketEvent('ticket', {
        type: ok ? 'TicketCheckSucceeded' : 'TicketCheckFailed',
        ticketId: event.ticketId
      });

      logger.info(`[Verification] Ticket ${event.ticketId} → ${ok ? 'USED' : 'DENIED'}`);
    } else {
      logger.warn(`[Verification] Type d'événement inconnu: ${event.type}`);
    }
  } catch (err) {
    logger.error(`[Verification] Erreur traitement: ${err.message}`);
  }
}

module.exports = { startConsumer };
