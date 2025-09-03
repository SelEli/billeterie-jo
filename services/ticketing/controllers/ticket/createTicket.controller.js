const logger = require('../../utils/logger');
const monitor = require('../../monitor/monitor');
const { createTicketService } = require('../../services/ticket/createTicket.service');
const { sendBusinessError } = require('../../utils/sendError');
const { sendBusinessSuccess } = require('../../utils/sendSuccess');
const { publishKafkaEvent } = require('../../utils/kafkaClient');

async function createTicketController(req, res) {
  if (!req.user || !['ADMIN', 'AGENT'].includes(req.user.role)) {
    return sendBusinessError(res, 'FORBIDDEN');
  }

  const missing = [];
  if (req.body.price == null) missing.push('price');
  if (!req.body.zone) missing.push('zone');
  if (req.body.eventId == null) missing.push('eventId');
  if (!req.body.status) missing.push('status');

  if (missing.length) {
    return sendBusinessError(res, 'MISSING_REQUIRED_FIELDS');
  }

  if (typeof req.body.price !== 'number' || req.body.price <= 0) {
    return sendBusinessError(res, 'INVALID_TICKET_DATA');
  }
  if (!Number.isInteger(Number(req.body.eventId)) || Number(req.body.eventId) <= 0) {
    return sendBusinessError(res, 'INVALID_EVENT_ID');
  }

  const timer = monitor.timer('ticket_create').start();
  try {
    // Forcer le statut initial à RESERVED
    const payload = { ...req.body, userId: req.user.userId, status: 'RESERVED' };
    const ticket = await createTicketService(payload, req.headers.authorization);

    try {
      await publishKafkaEvent('ticketing', {
        type: 'TicketCreated',
        ticketId: ticket.id,
        userId: ticket.userId,
        eventId: ticket.eventId,
        offerId: ticket.offerId,
        price: ticket.price,
        zone: ticket.zone,
        status: ticket.status
      });
    } catch (err) {
      logger.warn(`[TICKET][CREATE] Kafka publish skipped: ${err.message}`);
    }

    timer.stop();
    logger.info('[TICKET CONTROLLER] Ticket created successfully');

    const { secretKey, ...safeTicket } = ticket;
    return sendBusinessSuccess(
      res,
      'CREATE_TICKET',
      { ...safeTicket, ticketId: ticket.id },
      { message: 'Ticket created successfully' }
    );
  } catch (error) {
    timer.stop();
    logger.error('[TICKET CONTROLLER] Error creating ticket', error);
    return sendBusinessError(res, 'INTERNAL_SERVER_ERROR');
  }
}

module.exports = { createTicketController };
