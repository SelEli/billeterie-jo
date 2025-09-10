const { startKafkaConsumer } = require('./kafkaClient');
const { PrismaClient } = require('@prisma/client');
const logger = require('./logger');
const { createAdapters } = require('../adapters');

const prisma = new PrismaClient();
const { kafka: kafkaAdapter } = createAdapters();

async function startConsumer() {
  await startKafkaConsumer(
    'ticketing-service-group',
    ['user', 'ticket'],
    async (topic, event) => {
      if (topic === 'user') {
        await handleUserEvent(event);
      }
      if (topic === 'ticket') {
        await handleTicketReturn(event);
      }
    }
  );
}

async function handleUserEvent(event) {
  try {
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
        logger.info(`[User] ${event.userId} enregistré/mis à jour`);
        break;
      case 'UserDeleted':
        await prisma.user.delete({ where: { id: event.userId } });
        logger.info(`[User] ${event.userId} supprimé`);
        break;
      default:
        logger.warn(`[User] Type d'événement inconnu: ${event.type}`);
    }
  } catch (err) {
    logger.error(`[User] Erreur traitement: ${err.message}`);
  }
}

async function handleTicketReturn(event) {
  try {
    switch (event.type) {
      case 'PaymentSucceeded':
        await prisma.ticket.update({
          where: { id: event.ticketId },
          data: { status: 'VALID', paymentAt: new Date() }
        });
        logger.info(`[Ticket] ${event.ticketId} → VALID`);
        break;
      case 'PaymentFailed':
        await prisma.ticket.update({
          where: { id: event.ticketId },
          data: { status: 'PAYMENT_FAILED' }
        });
        logger.info(`[Ticket] ${event.ticketId} → PAYMENT_FAILED`);
        break;
      case 'TicketCheckSucceeded':
        await prisma.ticket.update({
          where: { id: event.ticketId },
          data: { status: 'USED', usedAt: new Date() }
        });
        logger.info(`[Ticket] ${event.ticketId} → USED`);
        break;
      case 'TicketCheckFailed':
        await prisma.ticket.update({
          where: { id: event.ticketId },
          data: { status: 'DENIED' }
        });
        logger.info(`[Ticket] ${event.ticketId} → DENIED`);
        break;
      case 'TicketCreated':
        logger.info(`[Ticket] Event interne reçu: TicketCreated pour ${event.ticketId}`);
        break;
      case 'TicketValidated':
        logger.info(`[Ticket] Event interne reçu: TicketValidated pour ${event.ticketId}`);
        break;
      case 'TicketVerified':
        logger.info(`[Ticket] Event interne reçu: TicketVerified pour ${event.ticketId}`);
        break;
      default:
        logger.warn(`[Ticket] Type d'événement inconnu: ${event.type}`);
    }
  } catch (err) {
    logger.error(`[Ticket] Erreur MAJ statut: ${err.message}`);
  }
}

// Fonctions pour envoyer les demandes
async function requestPayment(ticketId, amount) {
  return kafkaAdapter.publishTicketEvent('payment', {
    type: 'PaymentRequested',
    ticketId,
    amount
  });
}

async function requestVerification(ticketId) {
  return kafkaAdapter.publishTicketEvent('verification', {
    type: 'TicketCheckRequested',
    ticketId
  });
}

module.exports = { startConsumer, requestPayment, requestVerification };
