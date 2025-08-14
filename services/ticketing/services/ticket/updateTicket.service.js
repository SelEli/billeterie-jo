const prisma = require('../../utils/prismaClient');
const logger = require('../../utils/logger');

async function updateTicketService(id, data) {
  const numericId = typeof id === 'string' ? Number(id) : id;

  try {
    const ticket = await prisma.ticket.update({
      where: { id: numericId },
      data,
    });
    logger.info(`[TICKET] Updated: ${ticket.id}`);
    return ticket;
  } catch (err) {
    logger.error(`[TICKET] Failed to update ${id}: ${err.message}`);
    throw err;
  }
}

module.exports = { updateTicketService };
