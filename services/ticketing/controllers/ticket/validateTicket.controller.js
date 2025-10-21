const { createAdapters } = require('../../adapters');
const { validateTicketService } = require('../../services/ticket');
const monitor = require('../../monitor/monitor');

// Import centralisé depuis utils/index.js
const {
  logger,
  prisma,
  publishKafkaEvent,
  sendBusinessError,
  sendBusinessSuccess,
  ERROR_STATUS,
} = require('../../utils');


async function validateTicketController(req, res) {
  logger.info('[CTRL][VALIDATE] Entrée', {
    method: req.method,
    url: req.originalUrl,
    body: req.body,
    user: req.user
  });

  if (!req.user) {
    logger.warn('[CTRL][VALIDATE] FORBIDDEN - user absent');
    return sendBusinessError(res, 'FORBIDDEN', 403);
  }

  // req.body déjà validé par validateRequest(validateTicketSchema)
  const { ticketId } = req.body;

  const timer = monitor.timer('ticket_validate').start();
  try {
    // 1️⃣ Validation locale (signature, etc.)
    const validated = await validateTicketService(ticketId, req.user);
    if (!validated) {
      timer.stop();
      logger.warn('[CTRL][VALIDATE] TICKET_NOT_FOUND', { ticketId });
      return sendBusinessError(res, 'TICKET_NOT_FOUND', 404);
    }

    // 2️⃣ Passage en VALID
    const updated = await prisma.ticket.update({
      where: { id: ticketId },
      data: { status: 'VALID' }
    });
    logger.info('[CTRL][VALIDATE] Ticket passé en VALID', { ticketId: updated.id });

    // 3️⃣ Notifier Payment si activé
    if ((process.env.USE_EXTERNAL_PAYMENT || '').toLowerCase() === 'true') {
      const adapters = createAdapters();
      try {
        await adapters.payment.notifyPaymentConfirmed(ticketId, req.user);
        logger.info('[CTRL][VALIDATE] Notification envoyée à Payment', { ticketId });
      } catch (err) {
        logger.warn('[CTRL][VALIDATE] Échec notification Payment', { ticketId, error: err.message });
      }
    }

    // 4️⃣ Kafka event
    try {
      await publishKafkaEvent('ticketing', {
        type: 'TicketValidated',
        ticketId: updated.id,
        userId: updated.userId,
        eventId: updated.eventId,
        offerId: updated.offerId,
        price: updated.price,
        zone: updated.zone,
        status: updated.status
      });
    } catch (err) {
      logger.warn('[CTRL][VALIDATE] Kafka publish failed', { error: err.message });
    }

    timer.stop();

    // 5️⃣ Réponse
    const { secretKey, ...safeTicket } = updated;
    return sendBusinessSuccess(res, 'VALIDATE_TICKET', safeTicket, {
      message: 'Ticket validated successfully'
    }, 200);

  } catch (error) {
    timer.stop();
    logger.error('[CTRL][VALIDATE] Erreur validation ticket', { error: error.message });
    const code = error.message && error.message in ERROR_STATUS ? error.message : 'INTERNAL_SERVER_ERROR';
    return sendBusinessError(res, code, 500);
  }
}

module.exports = { validateTicketController };
