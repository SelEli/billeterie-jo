const monitor = require('../../monitor/monitor');
const {
  logger,
  sendBusinessError,
  sendBusinessSuccess,
  publishKafkaEvent,
  ERROR_STATUS,
  SUCCESS_STATUS,
  prisma
} = require('../../utils');
const { createTicketService } = require('../../services/ticket/createTicket.service');

async function createTicketController(req, res) {
  logger.info('[CTRL][CREATE] Entrée', { user: req.user, body: req.body });

  if (!req.user) {
    logger.warn('[CTRL][CREATE] req.user absent → FORBIDDEN');
    return sendBusinessError(res, 'FORBIDDEN');
  }

  const missing = [];
  if (req.body.price == null) missing.push('price');
  if (!req.body.zone) missing.push('zone');
  if (req.body.eventId == null) missing.push('eventId');
  if (!req.body.status) missing.push('status');
  if (missing.length) {
    logger.warn('[CTRL][CREATE] Champs manquants', { missing });
    return sendBusinessError(res, 'MISSING_REQUIRED_FIELDS');
  }

  if (typeof req.body.price !== 'number' || req.body.price <= 0) {
    return sendBusinessError(res, 'INVALID_TICKET_DATA');
  }
  if (!Number.isInteger(Number(req.body.eventId)) || Number(req.body.eventId) <= 0) {
    return sendBusinessError(res, 'INVALID_EVENT_ID');
  }

  logger.debug('[CTRL][CREATE] Vérif event capacity', { eventId: req.body.eventId });
  const event = await prisma.event.findUnique({
    where: { id: req.body.eventId },
    include: { tickets: true }
  });

  if (!event) {
    logger.warn('[CTRL][CREATE] EVENT_NOT_FOUND', { eventId: req.body.eventId });
    return sendBusinessError(res, 'EVENT_NOT_FOUND');
  }

  if (event.capacity != null && event.tickets.length >= event.capacity) {
    logger.warn('[CTRL][CREATE] EVENT_FULL', { eventId: req.body.eventId });
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

    logger.debug('[CTRL][CREATE] Appel service createTicketService', { payload });
    const ticket = await createTicketService(payload, req.user);

    timer.stop();
    logger.info('[CTRL][CREATE] Ticket créé', { ticketId: ticket.id });

    const { secretKey, ...safeTicket } = ticket;

    logger.debug('[CTRL][CREATE] Envoi réponse au client', { safeTicket });
    sendBusinessSuccess(res, 'CREATE_TICKET', safeTicket, {
      message: 'Ticket created successfully'
    });

    publishKafkaEvent('payment', {
      type: 'PaymentRequested',
      ticketId: ticket.id,
      amount: ticket.price
    }).catch(err =>
      logger.warn(`[CTRL][CREATE] Kafka publish vers payment échoué: ${err.message}`)
    );

    publishKafkaEvent('ticket', {
      type: 'TicketCreated',
      ticketId: ticket.id,
      userId: ticket.userId,
      eventId: ticket.eventId,
      offerId: ticket.offerId,
      price: ticket.price,
      zone: ticket.zone,
      status: ticket.status
    }).catch(err =>
      logger.warn(`[CTRL][CREATE] Kafka publish ticket échoué: ${err.message}`)
    );

  } catch (error) {
    timer.stop();
    logger.error('[CTRL][CREATE] Erreur création ticket', { error: error.message });
    const code =
      error.message && error.message in ERROR_STATUS
        ? error.message
        : 'INTERNAL_SERVER_ERROR';
    return sendBusinessError(res, code);
  }
}

module.exports = { createTicketController };
