const crypto = require('crypto');
const prisma = require('../../utils/prismaClient');
const logger = require('../../utils/logger');
const { ERROR_STATUS } = require('../../utils/httpErrorMap');
const { invalidateCachedTicket } = require('../../cache/ticket.cache');
const { createTicketSchema } = require('../../schemas/ticket.schema');

async function createTicketService(data, user) {
  logger.debug('[SERVICE][CREATE] Entrée', data);

  // 🔹 Validation Zod
  let parsed;
  try {
    parsed = createTicketSchema.parse(data);
  } catch (err) {
    logger.warn('[SERVICE][CREATE] Données invalides', err.errors);
    const e = new Error('INVALID_TICKET_DATA');
    e.statusCode = ERROR_STATUS.INVALID_TICKET_DATA;
    throw e;
  }

  const { eventId, userId, status, zone, offerId } = parsed;

  // 🔹 Vérification user cohérent
  if (!user || !user.userId || user.userId !== userId) {
    const e = new Error('USER_NOT_FOUND');
    e.statusCode = ERROR_STATUS.USER_NOT_FOUND;
    throw e;
  }

  // 🔹 Charger l’event
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) {
    const err = new Error('EVENT_NOT_FOUND');
    err.statusCode = ERROR_STATUS.EVENT_NOT_FOUND;
    throw err;
  }

  // 🔹 Vérifier que la zone existe si fournie
  if (zone && (!event.zones || !event.zones.includes(zone))) {
    const err = new Error('INVALID_ZONE');
    err.statusCode = ERROR_STATUS.INVALID_TICKET_DATA;
    throw err;
  }

  // 🔹 Charger l’offre si fournie (⚠️ plus de lien avec event)
  let offer = null;
  if (offerId) {
    offer = await prisma.offer.findUnique({ where: { id: offerId } });
    if (!offer) {
      const err = new Error('OFFER_NOT_FOUND');
      err.statusCode = ERROR_STATUS.OFFER_NOT_FOUND;
      throw err;
    }
  }

  // 🔹 Calcul du prix
  let price = event.basePrice;
  if (offer) {
    price = price * (1 - offer.discount);
  }

  // 🔹 Génération secretKey
  const secretKey = crypto.randomBytes(32).toString('hex');

  // 🔹 Création du ticket
  const ticket = await prisma.ticket.create({
    data: {
      price,
      zone,
      userId,
      status: status || 'RESERVED',
      secretKey,
      event: { connect: { id: event.id } },
      ...(offer ? { offer: { connect: { id: offer.id } } } : {})
    }
  });

  if (!ticket) {
    const err = new Error('INTERNAL_SERVER_ERROR');
    err.statusCode = ERROR_STATUS.INTERNAL_SERVER_ERROR;
    throw err;
  }

  logger.info('[SERVICE][CREATE] Ticket inséré', { ticketId: ticket.id });

  await invalidateCachedTicket(ticket.id);

  return ticket;
}

module.exports = { createTicketService };
