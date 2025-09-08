const logger = require('../utils/logger');
const { publishKafkaEvent } = require('../utils/kafkaClient');

async function startPaymentService(ticketId, amount, isMock = false) {
  const numericId = Number(ticketId);
  if (!numericId) {
    throw new Error('INVALID_TICKET_ID');
  }

  logger.info(`[PAYMENT SERVICE] Démarrage paiement pour ticket ${numericId} (mock=${isMock})`);

  if (isMock) {
    logger.debug('[PAYMENT SERVICE] Mode mock : paiement simulé');
  }

  await publishKafkaEvent('ticketing', {
    type: 'PaymentStarted',
    ticketId: numericId,
    amount: amount || null,
    startedAt: new Date().toISOString(),
    mode: isMock ? 'mock' : 'live'
  });

  return { ticketId: numericId, amount, status: 'PENDING' };
}

module.exports = { startPaymentService };
