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
const { TicketCreateSchema } = require('../../schemas/ticket.schema'); // 🔹 import du schéma

async function createTicketController(req, res) {
  logger.info('[CTRL][CREATE] Entrée', { user: req.user, body: req.body });

  if (!req.user) {
    logger.warn('[CTRL][CREATE] req.user absent → FORBIDDEN');
    return sendBusinessError(res, 'FORBIDDEN');
  }

  // ✅ Validation Zod
  let parsed;
  try {
    parsed = TicketCreateSchema.parse(req.body);
    logger.debug('[CTRL][CREATE] Validation réussie', parsed);
  } catch (err) {
    logger.warn('[CTRL][CREATE] Validation échouée', {
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

  // Vérif capacité event
  logger.debug('[CTRL][CREATE] Vérif event capacity', { eventId: parsed.eventId });
  const event = await prisma.event.findUnique({
    where: { id: parsed.eventId },
    include: { tickets: true }
  });

  if (!event) {
    logger.warn('[CTRL][CREATE] EVENT_NOT_FOUND', { eventId: parsed.eventId });
    return sendBusinessError(res, 'EVENT_NOT_FOUND');
  }

  if (event.capacity != null && event.tickets.length >= event.capacity) {
    logger.warn('[CTRL][CREATE] EVENT_FULL', { eventId: parsed.eventId });
    return sendBusinessError(res, 'EVENT_FULL');
  }

  const timer = monitor.timer('ticket_create').start();
  try {
    const payload = {
      ...parsed,
      userId: req.user.userId,
      role: req.user.role,
      status: 'RESERVED' // forcé côté back
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

    // Kafka events
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
