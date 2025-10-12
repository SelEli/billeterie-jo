const logger  = require('../../utils/logger');
const monitor = require('../../monitor/monitor');
const { updateTicketService } = require('../../services/ticket/updateTicket.service');
const { sendBusinessError } = require('../../utils/sendError');
const { sendBusinessSuccess } = require('../../utils/sendSuccess');
const { publishKafkaEvent } = require('../../utils/kafkaClient');
const { ERROR_STATUS } = require('../../utils/httpErrorMap');

async function updateTicketController(req, res) {
  const id = Number(req.params.id);
  logger.info('[CTRL][UPDATE] Entrée', { id, body: req.body, user: req.user });

  if (!Number.isInteger(id) || id <= 0) {
    logger.warn('[CTRL][UPDATE] INVALID_TICKET_ID', { id });
    return sendBusinessError(res, 'INVALID_TICKET_ID', 400);
  }

  // req.body déjà validé par validateRequest(updateTicketSchema)
  const parsed = { ...req.body, id };

  // Interdiction métier : ne pas forcer un ticket en VALID
  if (parsed.status && parsed.status === 'VALID') {
    logger.warn('[CTRL][UPDATE] Tentative de forcer VALID', { parsed });
    return sendBusinessError(res, 'INVALID_TICKET_STATUS', 400);
  }

  const { id: parsedId, ...safePayload } = parsed;
  logger.debug('[CTRL][UPDATE] Payload service', safePayload);

  const timer = monitor.timer('ticket_update').start();
  try {
    const ticket = await updateTicketService(id, safePayload);
    timer.stop();

    if (!ticket) {
      logger.warn('[CTRL][UPDATE] TICKET_NOT_FOUND', { id });
      return sendBusinessError(res, 'TICKET_NOT_FOUND', 404);
    }

    logger.info('[CTRL][UPDATE] Ticket mis à jour', { id: ticket.id, status: ticket.status });

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
      logger.error('[CTRL][UPDATE] Kafka publish failed', { error: err.message });
    }

    const { secretKey, ...safeTicket } = ticket;
    return sendBusinessSuccess(res, 'UPDATE_TICKET', safeTicket, {
      message: 'Ticket updated successfully'
    }, 200);

  } catch (error) {
    timer.stop();
    logger.error('[CTRL][UPDATE] Erreur update ticket', { error: error.message });
    const code = error.message && error.message in ERROR_STATUS ? error.message : 'INTERNAL_SERVER_ERROR';
    return sendBusinessError(res, code, 500);
  }
}

module.exports = { updateTicketController };
