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
    logger.warn('[TICKET][CREATE] Données invalides');
    const err = new Error('INVALID_TICKET_DATA');
    err.statusCode = ERROR_STATUS.INVALID_TICKET_DATA;
    throw err;
  }
  if (eventIdNum !== null && Number.isNaN(eventIdNum)) {
    logger.warn('[TICKET][CREATE] eventId invalide');
    const err = new Error('INVALID_TICKET_ID');
    err.statusCode = ERROR_STATUS.INVALID_TICKET_ID;
    throw err;
  }
  if (offerIdNum !== null && Number.isNaN(offerIdNum)) {
    logger.warn('[TICKET][CREATE] offerId invalide');
    const err = new Error('INVALID_TICKET_ID');
    err.statusCode = ERROR_STATUS.INVALID_TICKET_ID;
    throw err;
  }

  // Vérifier l'utilisateur via Auth
  let found = null;
  try {
    if (['ADMIN', 'AGENT', 'EMPLOYEE'].includes(role)) {
      const url = `${process.env.USER_URL}/${userId}`;
      logger.debug(`[TICKET][CREATE] Vérif utilisateur interne via ${url}`);
      const res = await axios.get(url, {
        headers: { Authorization: authHeader }
      });
      logger.debug('[TICKET][CREATE] Réponse Auth interne', res.data);
      if (res.data?.data) found = res.data.data;
    } else {
      const url = `${process.env.AUTH_URL}/profile`;
      logger.debug(`[TICKET][CREATE] Vérif utilisateur public via ${url}`);
      const res = await axios.get(url, {
        headers: { Authorization: authHeader }
      });
      logger.debug('[TICKET][CREATE] Réponse Auth public', res.data);
      if (res.data?.data) found = res.data.data;
    }
  } catch (err) {
    logger.warn(`[TICKET SERVICE] User check failed: ${err.message}`);
  }
  if (!found) {
    logger.warn('[TICKET][CREATE] Utilisateur introuvable');
    const e = new Error('USER_NOT_FOUND');
    e.statusCode = ERROR_STATUS.USER_NOT_FOUND;
    throw e;
  }

  // Vérifier existence event
  logger.debug(`[TICKET][CREATE] Vérif event ${eventIdNum}`);
  const event = await prisma.event.findUnique({ where: { id: eventIdNum } });
  if (!event) {
    logger.warn(`[TICKET][CREATE] Event ${eventIdNum} introuvable`);
    const err = new Error('EVENT_NOT_FOUND');
    err.statusCode = ERROR_STATUS.EVENT_NOT_FOUND;
    throw err;
  }

  // Vérifier existence offer si fourni
  if (offerIdNum !== null) {
    logger.debug(`[TICKET][CREATE] Vérif offer ${offerIdNum}`);
    const offer = await prisma.offer.findUnique({ where: { id: offerIdNum } });
    if (!offer) {
      logger.warn(`[TICKET][CREATE] Offer ${offerIdNum} introuvable`);
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

  logger.debug('[TICKET][CREATE] Insertion ticket', data);
  const ticket = await prisma.ticket.create({ data });

  if (!ticket) {
    logger.error('[TICKET][CREATE] Erreur interne lors de la création');
    const err = new Error('INTERNAL_SERVER_ERROR');
    err.statusCode = ERROR_STATUS.INTERNAL_SERVER_ERROR;
    throw err;
  }

  logger.info(`[TICKET] Created: ${ticket.id}`);
  return ticket;
}

module.exports = { createTicketService };
