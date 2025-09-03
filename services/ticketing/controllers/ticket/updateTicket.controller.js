// controllers/ticket/updateTicket.controller.js
const logger  = require('../../utils/logger');
const monitor = require('../../monitor/monitor');
const { updateTicketService } = require('../../services/ticket/updateTicket.service');
const { sendBusinessError } = require('../../utils/sendError');
const { sendBusinessSuccess } = require('../../utils/sendSuccess');
const { publishKafkaEvent } = require('../../utils/kafkaClient');

async function updateTicketController(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return sendBusinessError(res, 'INVALID_TICKET_ID');
  }

  const timer = monitor.timer('ticket_update').start();
  try {
    // Pas de passage à VALID ici: réservé à Payment
    if (req.body.status && req.body.status === 'VALID') {
      return sendBusinessError(res, 'INVALID_TICKET_STATUS');
    }

    const updates = { ...req.body };
    const ticket  = await updateTicketService(id, updates);
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
    return sendBusinessSuccess(res, 'UPDATE_TICKET', safeTicket, { message: 'Ticket updated successfully' });
  } catch (error) {
    timer.stop();
    logger.error('Error updating ticket', error);
    return sendBusinessError(res, 'INTERNAL_SERVER_ERROR');
  }
}

module.exports = { updateTicketController };
