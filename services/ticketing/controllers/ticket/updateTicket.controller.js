const logger  = require('../../utils/logger');
const monitor = require('../../monitor/monitor');
const { updateTicketService } = require('../../services/ticket/updateTicket.service');
const { sendBusinessError } = require('../../utils/sendError');
const { sendBusinessSuccess } = require('../../utils/sendSuccess');
const { publishKafkaEvent } = require('../../utils/kafkaClient');
const { ERROR_STATUS } = require('../../utils/httpErrorMap');
const { TicketUpdateSchema } = require('../../schemas/ticket.schema'); // 🔹 import

async function updateTicketController(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return sendBusinessError(res, 'INVALID_TICKET_ID');
  }

  // ✅ Validation Zod
  let parsed;
  try {
    parsed = TicketUpdateSchema.parse({ ...req.body, id });
    logger.debug('[TICKET][UPDATE] Validation réussie', parsed);
  } catch (err) {
    logger.warn('[TICKET][UPDATE] Validation échouée', {
      issues: err.issues?.map(i => ({
        path: i.path,
        message: i.message
      }))
    });
    return sendBusinessError(
      res,
      'INVALID_TICKET_DATA',
      err.issues?.map(i => i.message)
    );
  }

  // Interdiction métier : ne pas forcer un ticket en VALID
  if (parsed.status && parsed.status === 'VALID') {
    return sendBusinessError(res, 'INVALID_TICKET_STATUS');
  }

  const { id: ignored, ...safePayload } = parsed;

  const timer = monitor.timer('ticket_update').start();
  try {
    logger.debug('[TICKET][UPDATE] Appel service updateTicketService', { id, safePayload });
    const ticket = await updateTicketService(id, safePayload);
    timer.stop();

    if (!ticket) {
      return sendBusinessError(res, 'TICKET_NOT_FOUND');
    }

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
      logger.warn(`[TICKET][UPDATE] Kafka publish skipped: ${err.message}`);
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
