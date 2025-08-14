const prisma = require('../../utils/prismaClient');
const logger = require('../../utils/logger');

async function createTicketService({
  price,
  zone,
  eventId,
  status,
  userId,
  offerId = null
}) {
  logger.debug('[createTicket.service] appel Prisma.create avec :', {
    price, zone, userId, eventId, status, offerId
  });

  try {
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
      throw new Error('[createTicket.service] Données invalides');
    }
    if (eventIdNum !== null && Number.isNaN(eventIdNum)) {
      throw new Error('[createTicket.service] eventId invalide');
    }
    if (offerIdNum !== null && Number.isNaN(offerIdNum)) {
      throw new Error('[createTicket.service] offerId invalide');
    }

    const data = {
      price,
      zone,
      userId,
      status,
      eventId: eventIdNum,
      offerId: offerIdNum
    };

    const ticket = await prisma.ticket.create({ data });

    logger.info(`[TICKET] Created: ${ticket.id}`);
    return ticket;
  } catch (error) {
    logger.error('[createTicket.service] erreur Prisma.create:', error);
    throw new Error('createTicketService: échec de création du ticket');
  }
}

module.exports = { createTicketService };
