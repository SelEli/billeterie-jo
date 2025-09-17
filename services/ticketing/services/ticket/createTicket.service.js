const crypto = require('crypto');
const prisma = require('../../utils/prismaClient');
const logger = require('../../utils/logger');
const axios = require('axios');
const { ERROR_STATUS } = require('../../utils/httpErrorMap');
const { invalidateCachedTicket } = require('../../cache/ticket.cache');

async function createTicketService(
  { price, zone, eventId, status, userId, role, offerId = null },
  authHeader
) {
  logger.debug('[TICKET][CREATE] Payload reçu', { price, zone, userId, role, eventId, status, offerId });

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
    logger.warn('[TICKET][CREATE] Données invalides');
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

  let found = null;
  try {
    if (['ADMIN', 'AGENT', 'EMPLOYEE'].includes(role)) {
      const url = `${process.env.USER_URL}/${userId}`;
      logger.debug(`[TICKET][CREATE] Vérif utilisateur interne via ${url}`);
      const res = await axios.get(url, { headers: { Authorization: authHeader } });
      if (res.data?.data) found = res.data.data;
    } else {
      const url = `${process.env.AUTH_URL}/profile`;
      logger.debug(`[TICKET][CREATE] Vérif utilisateur public via ${url}`);
      const res = await axios.get(url, { headers: { Authorization: authHeader } });
      if (res.data?.data) found = res.data.data;
    }
  } catch (err) {
    logger.warn(`[TICKET SERVICE] User check failed: ${err.message}`);
  }

  if (!found) {
    const e = new Error('USER_NOT_FOUND');
    e.statusCode = ERROR_STATUS.USER_NOT_FOUND;
    throw e;
  }

  const event = await prisma.event.findUnique({ where: { id: eventIdNum } });
  if (!event) {
    const err = new Error('EVENT_NOT_FOUND');
    err.statusCode = ERROR_STATUS.EVENT_NOT_FOUND;
    throw err;
  }

  if (offerIdNum !== null) {
    const offer = await prisma.offer.findUnique({ where: { id: offerIdNum } });
    if (!offer) {
      const err = new Error('OFFER_NOT_FOUND');
      err.statusCode = ERROR_STATUS.OFFER_NOT_FOUND;
      throw err;
    }
  }

  const secretKey = crypto.randomBytes(32).toString('hex');

  logger.debug('[TICKET][CREATE] Insertion ticket', {
    price,
    zone,
    userId,
    status,
    eventId: eventIdNum,
    offerId: offerIdNum,
    secretKey
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

  // Invalidation cache (au cas où un cache de liste ou de détail existe déjà)
  await invalidateCachedTicket(ticket.id);

  logger.info(`[TICKET] Created: ${ticket.id}`);
  return ticket;
}

module.exports = { createTicketService };
