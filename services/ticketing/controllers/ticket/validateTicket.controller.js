const { createAdapters } = require('../../adapters');
const { validateTicketService } = require('../../services/ticket/validateTicket.service');
const { sendBusinessError } = require('../../utils/sendError');
const { sendBusinessSuccess } = require('../../utils/sendSuccess');
const logger = require('../../utils/logger');
const prisma = require('../../utils/prismaClient');
const { publishKafkaEvent } = require('../../utils/kafkaClient');

async function validateTicketController(req, res) {
  logger.info('[VALIDATE CTRL] Incoming request', {
    method: req.method,
    url: req.originalUrl,
    body: req.body,
    user: req.user
  });

  if (!req.user) {
    return sendBusinessError(res, 'FORBIDDEN');
  }

  // Ici, req.body est déjà validé par validateRequest(validateTicketSchema)
  const { ticketId } = req.body;

  try {
    // 1️⃣ Validation locale (signature, etc.)
    const validated = await validateTicketService(ticketId, req.user);
    if (!validated) {
      return sendBusinessError(res, 'TICKET_NOT_FOUND');
    }

    // 2️⃣ Passage en VALID
    const updated = await prisma.ticket.update({
      where: { id: ticketId },
      data: { status: 'VALID' }
    });
    logger.info('[VALIDATE CTRL] Ticket passé en VALID', { ticketId: updated.id });

    // 3️⃣ Notifier Payment si activé
    if ((process.env.USE_EXTERNAL_PAYMENT || '').toLowerCase() === 'true') {
      const adapters = createAdapters();
      try {
        await adapters.payment.notifyPaymentConfirmed(ticketId, req.user);
        logger.info('[VALIDATE CTRL] Notification envoyée à Payment', { ticketId });
      } catch (err) {
        logger.warn('[VALIDATE CTRL] Échec notification Payment', {
          ticketId,
          error: err.message
        });
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
      logger.warn(`[VALIDATE CTRL] Kafka publish skipped: ${err.message}`);
    }

    // 5️⃣ Réponse
    const { secretKey, ...safeTicket } = updated;
    return sendBusinessSuccess(res, 'VALIDATE_TICKET', safeTicket, {
      message: 'Ticket validated successfully'
    });

  } catch (err) {
    logger.error('[VALIDATE CTRL] Error', { message: err.message });
    const code = err && err.message ? err.message : 'INTERNAL_SERVER_ERROR';
    return sendBusinessError(res, code);
  }
}

module.exports = { validateTicketController };
