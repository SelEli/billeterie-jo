const logger  = require('../../utils/logger');
const monitor = require('../../monitor/monitor');
const { updateTicketService } = require('../../services/ticket/updateTicket.service');
const { sendBusinessError } = require('../../utils/sendError');
const { sendBusinessSuccess } = require('../../utils/sendSuccess');
const { publishKafkaEvent } = require('../../utils/kafkaClient');
const { ERROR_STATUS } = require('../../utils/httpErrorMap');

async function updateTicketController(req, res) {
  const id = Number(req.params.id);
  logger.info('[TICKET][UPDATE] Incoming request', {
    id,
    body: req.body,
    user: req.user
  });

  if (!Number.isInteger(id) || id <= 0) {
    logger.error('[TICKET][UPDATE] INVALID_TICKET_ID', { id });
    return sendBusinessError(res, 'INVALID_TICKET_ID');
  }

  // Ici, req.body est déjà validé par validateRequest(updateTicketSchema)
  const parsed = { ...req.body, id };

  // Interdiction métier : ne pas forcer un ticket en VALID
  if (parsed.status && parsed.status === 'VALID') {
    logger.warn('[TICKET][UPDATE] Tentative de forcer un ticket en VALID', { parsed });
    return sendBusinessError(res, 'INVALID_TICKET_STATUS');
  }

  const { id: parsedId, ...safePayload } = parsed;
  logger.info('[TICKET][UPDATE] Payload envoyé au service', safePayload);

  const timer = monitor.timer('ticket_update').start();
  try {
    const ticket = await updateTicketService(id, safePayload);
    timer.stop();

    if (!ticket) {
      logger.error('[TICKET][UPDATE] Ticket introuvable après update', { id });
      return sendBusinessError(res, 'TICKET_NOT_FOUND');
    }

    logger.info('[TICKET][UPDATE] Ticket mis à jour en base', {
      id: ticket.id,
      status: ticket.status
    });

    try {
      await publishKafkaEvent('ticketing', {
        type: 'TicketUpdated',
        ticketId: ticket.id,
        userId: ticket.userId,
        eventId: ticket.eventId,
        offerId: ticket.offerId,
        price: ticket.price,
        zone: ticket.zone,
        status: ticket.status
      });
    } catch (err) {
      logger.error('[TICKET][UPDATE] Kafka publish failed', { error: err.message });
    }

    const { secretKey, ...safeTicket } = ticket;
    return sendBusinessSuccess(res, 'UPDATE_TICKET', safeTicket, {
      message: 'Ticket updated successfully'
    });
  } catch (error) {
    timer.stop();
    logger.error('[TICKET][UPDATE] Erreur update ticket', { error: error.message });
    const code =
      error.message && error.message in ERROR_STATUS
        ? error.message
        : 'INTERNAL_SERVER_ERROR';
    return sendBusinessError(res, code);
  }
}

module.exports = { updateTicketController };
