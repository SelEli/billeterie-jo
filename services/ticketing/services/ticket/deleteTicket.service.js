// services/ticket/deleteTicket.service.js
const prisma = require('../../utils/prismaClient');
const logger = require('../../utils/logger');

async function deleteTicketService(id) {
  const numericId = typeof id === 'string' ? Number(id) : id;

  try {
    const deleted = await prisma.ticket.delete({ where: { id: numericId } });

    if (!deleted) {
      const err = new Error('Ticket not found');
      err.statusCode = 404;
      throw err;
    }

    logger.info(`[TICKET] Deleted: ${deleted.id}`);
    return deleted;
  } catch (err) {
    logger.error(`[TICKET] Failed to delete ${id}: ${err.message}`);
    throw err;
  }
}

module.exports = { deleteTicketService };
