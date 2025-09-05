const logger = require('../../utils/logger');
const monitor = require('../../monitor/monitor');
const { createTicketService } = require('../../services/ticket/createTicket.service');
const { sendBusinessError } = require('../../utils/sendError');
const { sendBusinessSuccess } = require('../../utils/sendSuccess');
const { publishKafkaEvent } = require('../../utils/kafkaClient');
const { ERROR_STATUS } = require('../../utils/httpErrorMap');

async function createTicketController(req, res) {
  logger.debug('[TICKET CONTROLLER] Requête création ticket reçue', {
    user: req.user,
    body: req.body
  });

  // Autorisation
  if (!req.user || !['ADMIN', 'AGENT'].includes(req.user.role)) {
    return sendBusinessError(res, 'FORBIDDEN');
  }

  // Champs obligatoires
  const missing = [];
  if (req.body.price == null) missing.push('price');
  if (!req.body.zone) missing.push('zone');
  if (req.body.eventId == null) missing.push('eventId');
  if (!req.body.status) missing.push('status');
  if (missing.length) {
    logger.warn('[TICKET CONTROLLER] Champs manquants', { missing });
    return sendBusinessError(res, 'MISSING_REQUIRED_FIELDS');
  }

  // Validation basique
  if (typeof req.body.price !== 'number' || req.body.price <= 0) {
    return sendBusinessError(res, 'INVALID_TICKET_DATA');
  }
  if (!Number.isInteger(Number(req.body.eventId)) || Number(req.body.eventId) <= 0) {
    return sendBusinessError(res, 'INVALID_EVENT_ID');
  }

  const timer = monitor.timer('ticket_create').start();
  try {
    const payload = {
      ...req.body,
      userId: req.user.userId,
      role: req.user.role,
      status: 'RESERVED' // forcé à RESERVED à la création
    };

    logger.debug('[TICKET CONTROLLER] Appel service createTicketService', payload);
    const ticket = await createTicketService(payload, req.headers.authorization);

    // Publication Kafka (non bloquante)
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
      logger.warn(`[TICKET CONTROLLER] Kafka publish skipped: ${err.message}`);
    }

    timer.stop();
    logger.info('[TICKET CONTROLLER] Ticket créé avec succès', { ticketId: ticket.id });

    const { secretKey, ...safeTicket } = ticket;
    return sendBusinessSuccess(res, 'CREATE_TICKET', safeTicket, {
      message: 'Ticket created successfully'
    });
  } catch (error) {
    timer.stop();
    logger.error('[TICKET CONTROLLER] Erreur création ticket', { error: error.message });
    const code =
      error.message && error.message in ERROR_STATUS
        ? error.message
        : 'INTERNAL_SERVER_ERROR';
    return sendBusinessError(res, code);
  }
}

module.exports = { createTicketController };
