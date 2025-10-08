const monitor = require('../../monitor/monitor');
const {
  logger,
  sendBusinessError,
  sendBusinessSuccess,
  publishKafkaEvent,
  ERROR_STATUS,
  prisma
} = require('../../utils');
const { createTicketService } = require('../../services/ticket/createTicket.service');

async function createTicketController(req, res) {
  logger.debug('[TICKET CONTROLLER] Requête création ticket reçue', {
    user: req.user,
    body: req.body
  });

  if (!req.user) {
    return sendBusinessError(res, 'FORBIDDEN');
  }

  const missing = [];
  if (req.body.price == null) missing.push('price');
  if (!req.body.zone) missing.push('zone');
  if (req.body.eventId == null) missing.push('eventId');
  if (!req.body.status) missing.push('status');
  if (missing.length) {
    logger.warn('[TICKET CONTROLLER] Champs manquants', { missing });
    return sendBusinessError(res, 'MISSING_REQUIRED_FIELDS');
  }

  if (typeof req.body.price !== 'number' || req.body.price <= 0) {
    return sendBusinessError(res, 'INVALID_TICKET_DATA');
  }
  if (!Number.isInteger(Number(req.body.eventId)) || Number(req.body.eventId) <= 0) {
    return sendBusinessError(res, 'INVALID_EVENT_ID');
  }

  // ⚡ Vérification capacité
  const event = await prisma.event.findUnique({
    where: { id: req.body.eventId },
    include: { tickets: true }
  });

  if (!event) {
    return sendBusinessError(res, 'EVENT_NOT_FOUND');
  }

  if (event.capacity != null && event.tickets.length >= event.capacity) {
    return sendBusinessError(res, 'EVENT_FULL');
  }

  const timer = monitor.timer('ticket_create').start();
  try {
    const payload = {
      ...req.body,
      userId: req.user.userId,
      role: req.user.role,
      status: 'RESERVED'
    };

    logger.debug('[TICKET CONTROLLER] Appel service createTicketService', payload);
    // 👉 On passe directement req.user au service
    const ticket = await createTicketService(payload, req.user);

    // Publication Kafka vers payment-service
    try {
      await publishKafkaEvent('payment', {
        type: 'PaymentRequested',
        ticketId: ticket.id,
        amount: ticket.price
      });
      logger.debug(`[TICKET CONTROLLER] PaymentRequested publié pour ticket ${ticket.id}`);
    } catch (err) {
      logger.warn(`[TICKET CONTROLLER] Kafka publish vers payment échoué: ${err.message}`);
    }

    // Publication Kafka interne sur "ticket"
    try {
      await publishKafkaEvent('ticket', {
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
