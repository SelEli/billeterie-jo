const prisma = require('../../utils/prismaClient');
const { invalidateCachedTicket } = require('../../cache/ticket.cache');
const { success, error } = require('../../utils/response');

/**
 * Marque un ticket comme USED
 * @param {object} payload - { ticketId }
 */
async function verifyTicketService(payload) {
  console.log('>>> [VERIFY SERVICE] Payload reçu:', payload);

  const { ticketId } = payload;
  const numericId = Number(ticketId);

  console.log('>>> [VERIFY SERVICE] ticketId brut:', ticketId, ' → converti en:', numericId);

  if (!numericId) {
    console.log('>>> [VERIFY SERVICE] ticketId invalide:', ticketId);
    return error(['INVALID_TICKET_ID']);
  }

  try {
    console.log('>>> [VERIFY SERVICE] Recherche ticket en base pour id:', numericId);
    const ticket = await prisma.ticket.findUnique({ where: { id: numericId } });
    console.log('>>> [VERIFY SERVICE] Ticket trouvé en base:', ticket);

    if (!ticket) {
      console.log('>>> [VERIFY SERVICE] Aucun ticket trouvé pour id', numericId);
      return error(['TICKET_NOT_FOUND']);
    }

    console.log('>>> [VERIFY SERVICE] Vérification status actuel du ticket:', ticket.status);
    if (ticket.status !== 'VALID') {
      console.log('>>> [VERIFY SERVICE] Ticket pas en VALID, status actuel:', ticket.status);
      return error(['TICKET_NOT_VALID']);
    }

    console.log('>>> [VERIFY SERVICE] Mise à jour du ticket en USED...');
    const updated = await prisma.ticket.update({
      where: { id: numericId },
      data: { status: 'USED' }
    });
    console.log('>>> [VERIFY SERVICE] Ticket mis à jour en base:', updated);

    console.log('>>> [VERIFY SERVICE] Invalidation du cache pour ticket:', numericId);
    await invalidateCachedTicket(numericId);

    console.log('>>> [VERIFY SERVICE] Succès final, retour au controller');
    return success({ ticketId: numericId, status: 'USED' });
  } catch (err) {
    console.log('>>> [VERIFY SERVICE] Exception attrapée lors du passage en USED:', {
      message: err.message,
      stack: err.stack
    });
    return error([err.message], 500);
  }
}

module.exports = { verifyTicketService };
