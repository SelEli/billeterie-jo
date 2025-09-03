const crypto = require('crypto');
const prisma = require('../../utils/prismaClient');
const logger = require('../../utils/logger');
const axios = require('axios');
const { ERROR_STATUS } = require('../../utils/httpErrorMap');

async function createTicketService({ price, zone, eventId, status, userId, offerId = null }, authHeader) {
  logger.debug('[TICKET][CREATE] Payload reçu', { price, zone, userId, eventId, status, offerId });

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
  try {
    const res = await axios.get(`${process.env.AUTH_SERVICE_URL}/user/${userId}`, {
      headers: { Authorization: authHeader }
    });
    if (!res.data || !res.data.data) {
      const err = new Error('USER_NOT_FOUND');
      err.statusCode = ERROR_STATUS.USER_NOT_FOUND;
      throw err;
    }
  } catch (err) {
    logger.warn(`[TICKET SERVICE] User check failed: ${err.message}`);
    const e = new Error('USER_NOT_FOUND');
    e.statusCode = ERROR_STATUS.USER_NOT_FOUND;
    throw e;
  }

  const secretKey = crypto.randomBytes(32).toString('hex');
  const signature = crypto
    .createHmac('sha256', secretKey) // plus d'invisibleKey locale
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

  logger.info(`[TICKET] Created: ${ticket.id}`);
  return ticket;
}

module.exports = { createTicketService };
