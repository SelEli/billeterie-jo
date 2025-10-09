const crypto = require('crypto');
const prisma = require('../../utils/prismaClient');
const logger = require('../../utils/logger');
const { ERROR_STATUS } = require('../../utils/httpErrorMap');
const { invalidateCachedTicket } = require('../../cache/ticket.cache');

async function createTicketService(
  { price, zone, eventId, status, userId, role, offerId = null },
  user
) {
  logger.debug('[SERVICE][CREATE] Entrée', { price, zone, userId, role, eventId, status, offerId });
  logger.debug('[SERVICE][CREATE] user reçu', user);

  const toNumOrNull = (v) =>
    v === null || v === undefined ? null : (typeof v === 'string' ? Number(v) : v);

  const eventIdNum = toNumOrNull(eventId);
  const offerIdNum = toNumOrNull(offerId);

  if (
    typeof price !== 'number' ||
    typeof zone !== 'string' ||
    typeof userId !== 'number' ||
    typeof status !== 'string'
  ) {
    logger.warn('[SERVICE][CREATE] Données invalides');
    const err = new Error('INVALID_TICKET_DATA');
    err.statusCode = ERROR_STATUS.INVALID_TICKET_DATA;
    throw err;
  }

  if (eventIdNum !== null && Number.isNaN(eventIdNum)) {
    const err = new Error('INVALID_TICKET_ID');
    err.statusCode = ERROR_STATUS.INVALID_TICKET_ID;
    throw err;
  }

  if (offerIdNum !== null && Number.isNaN(offerIdNum)) {
    const err = new Error('INVALID_TICKET_ID');
    err.statusCode = ERROR_STATUS.INVALID_TICKET_ID;
    throw err;
  }

  if (!user || !user.userId || user.userId !== userId) {
    logger.error('[SERVICE][CREATE] USER_NOT_FOUND ou incohérence', { user, userId });
    const e = new Error('USER_NOT_FOUND');
    e.statusCode = ERROR_STATUS.USER_NOT_FOUND;
    throw e;
  }

  logger.debug('[SERVICE][CREATE] Prisma findUnique event', { eventId: eventIdNum });
  const event = await prisma.event.findUnique({ where: { id: eventIdNum } });
  if (!event) {
    const err = new Error('EVENT_NOT_FOUND');
    err.statusCode = ERROR_STATUS.EVENT_NOT_FOUND;
    throw err;
  }

  if (offerIdNum !== null) {
    logger.debug('[SERVICE][CREATE] Prisma findUnique offer', { offerId: offerIdNum });
    const offer = await prisma.offer.findUnique({ where: { id: offerIdNum } });
    if (!offer) {
      const err = new Error('OFFER_NOT_FOUND');
      err.statusCode = ERROR_STATUS.OFFER_NOT_FOUND;
      throw err;
    }
  }

  const secretKey = crypto.randomBytes(32).toString('hex');

  logger.debug('[SERVICE][CREATE] Prisma ticket.create', {
    price,
    zone,
    userId,
    status,
    eventId: eventIdNum,
    offerId: offerIdNum
  });

  const ticket = await prisma.ticket.create({
    data: {
      price,
      zone,
      userId,
      status,
      secretKey,
      event: { connect: { id: eventIdNum } },
      ...(offerIdNum !== null && { offer: { connect: { id: offerIdNum } } })
    }
  });

  if (!ticket) {
    const err = new Error('INTERNAL_SERVER_ERROR');
    err.statusCode = ERROR_STATUS.INTERNAL_SERVER_ERROR;
    throw err;
  }

  logger.info('[SERVICE][CREATE] Ticket inséré', { ticketId: ticket.id });

  // Invalidation cache
  logger.debug('[SERVICE][CREATE] Invalidation cache', { ticketId: ticket.id });
  await invalidateCachedTicket(ticket.id);

  logger.info('[SERVICE][CREATE] Succès complet', { ticketId: ticket.id });
  return ticket;
}

module.exports = { createTicketService };
