// services/ticket/createTicket.service.js
const prisma = require('../../utils/prismaClient');

async function createTicketService({
  price,
  zone,
  eventId,
  status,
  userId,
  offerId = null
}) {
  console.log(
    '[createTicket.service] appel Prisma.create avec :',
    { price, zone, userId, eventId, status, offerId }
  );

  try {
    // Conversions minimales pour supporter strings numériques et null
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

    console.log('[createTicket.service] ticket créé :', ticket);
    return ticket;
  } catch (error) {
    console.error('[createTicket.service] erreur Prisma.create:', error);
    throw new Error('createTicketService: échec de création du ticket');
  }
}

module.exports = { createTicketService };
