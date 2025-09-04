// services/ticket/createTicket.service.js
const crypto = require('crypto');
const prisma = require('../../utils/prismaClient');
const logger = require('../../utils/logger');
const axios = require('axios');
const { ERROR_STATUS } = require('../../utils/httpErrorMap');

/**
 * Création d'un ticket :
 * - Validation des données
 * - Vérification de l'utilisateur via Auth (/user/:id pour internes, /auth/profile pour publics)
 * - Vérification existence event/offer
 * - Génération secretKey + signature
 * - Insertion en base
 */
async function createTicketService(
  { price, zone, eventId, status, userId, role, offerId = null },
  authHeader
) {
  logger.debug('[TICKET][CREATE] Payload reçu', { price, zone, userId, role, eventId, status, offerId });

  const toNumOrNull = (v) =>
    v === null || v === undefined ? null : (typeof v === 'string' ? Number(v) : v);

  const eventIdNum = toNumOrNull(eventId);
  const offerIdNum = toNumOrNull(offerId);

  // Validation basique
  if (
    typeof price !== 'number' ||
    typeof zone !== 'string' ||
    typeof userId !== 'number' ||
    typeof status !== 'string'
  ) {
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

  // Vérifier l'utilisateur via Auth
  let found = null;
  try {
    if (['ADMIN', 'AGENT', 'EMPLOYEE'].includes(role)) {
      const res = await axios.get(`${process.env.USER_URL}/${userId}`, {
        headers: { Authorization: authHeader }
      });
      if (res.data?.data) found = res.data.data;
    } else {
      const res = await axios.get(`${process.env.AUTH_URL}/profile`, {
        headers: { Authorization: authHeader }
      });
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

  // Vérifier existence event
  const event = await prisma.event.findUnique({ where: { id: eventIdNum } });
  if (!event) {
    const err = new Error('EVENT_NOT_FOUND');
    err.statusCode = ERROR_STATUS.EVENT_NOT_FOUND;
    throw err;
  }

  // Vérifier existence offer si fourni
  if (offerIdNum !== null) {
    const offer = await prisma.offer.findUnique({ where: { id: offerIdNum } });
    if (!offer) {
      const err = new Error('OFFER_NOT_FOUND');
      err.statusCode = ERROR_STATUS.OFFER_NOT_FOUND;
      throw err;
    }
  }

  // Génération des clés
  const secretKey = crypto.randomBytes(32).toString('hex');
  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(secretKey)
    .digest('hex');

  const data = {
    price,
    zone,
    userId,
    status,
    eventId: eventIdNum,
    offerId: offerIdNum,
    secretKey,
    signature
  };

  const ticket = await prisma.ticket.create({ data });

  if (!ticket) {
    const err = new Error('INTERNAL_SERVER_ERROR');
    err.statusCode = ERROR_STATUS.INTERNAL_SERVER_ERROR;
    throw err;
  }

  logger.info(`[TICKET] Created: ${ticket.id}`);
  return ticket;
}

module.exports = { createTicketService };