const prisma = require('../../utils/prismaClient');
const { invalidateCachedTicket } = require('../../cache/ticket.cache');
const { success, error } = require('../../utils/response');

/**
 * Marque un ticket comme USED
 * @param {object} payload - { ticketId }
 */
async function verifyTicketService(payload) {
  const { ticketId } = payload;
  const numericId = Number(ticketId);

  console.log('>>> [VERIFY SERVICE] Payload reçu:', payload);

  if (!numericId) {
    console.log('>>> [VERIFY SERVICE] ticketId invalide:', ticketId);
    return error(['INVALID_TICKET_ID']);
  }

  try {
    const ticket = await prisma.ticket.findUnique({ where: { id: numericId } });
    console.log('>>> [VERIFY SERVICE] Ticket trouvé:', ticket);

    if (!ticket) {
      console.log('>>> [VERIFY SERVICE] Aucun ticket trouvé pour id', numericId);
      return error(['TICKET_NOT_FOUND']);
    }

    if (ticket.status !== 'VALID') {
      console.log('>>> [VERIFY SERVICE] Ticket pas en VALID, status actuel:', ticket.status);
      return error(['TICKET_NOT_VALID']);
    }

    const updated = await prisma.ticket.update({
      where: { id: numericId },
      data: { status: 'USED' }
    });

    console.log('>>> [VERIFY SERVICE] Ticket mis à jour:', updated);

    await invalidateCachedTicket(numericId);

    return success({ ticketId: numericId, status: 'USED' });
  } catch (err) {
    console.log('>>> [VERIFY SERVICE] Erreur lors du passage en USED:', err);
    return error([err.message], 500);
  }
}

module.exports = { verifyTicketService };
