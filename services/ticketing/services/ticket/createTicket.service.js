// services/ticket/createTicket.service.js
const prisma = require('../../utils/prismaClient');

async function createTicketService({
  price,
  zone,
  eventId,
  status,           // ajouté
  userId,
  offerId = null    // optionnel
}) {
  console.log(
    '[createTicket.service] appel Prisma.create avec :',
    { price, zone, userId, eventId, status, offerId }
  );

  try {
    if (
      typeof price   !== 'number' ||
      typeof zone    !== 'string' ||
      typeof userId  !== 'number' ||
      typeof eventId !== 'number' ||
      typeof status  !== 'string'
    ) {
      throw new Error('[createTicket.service] Données invalides');
    }

    const data = { price, zone, userId, eventId, status };
    if (offerId !== null) data.offerId = offerId;

    const ticket = await prisma.ticket.create({ data });

    console.log('[createTicket.service] ticket créé :', ticket);
    return ticket;
  } catch (error) {
    console.error('[createTicket.service] erreur Prisma.create:', error);
    throw new Error('createTicketService: échec de création du ticket');
  }
}

module.exports = { createTicketService };
