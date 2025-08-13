// services/ticket/readTicket.service.js
const prisma = require('../../utils/prismaClient');
const { timer } = require('../../monitor/monitor');
const logger = require('../../utils/logger');
const { cacheTicket, getCachedTicket } = require('../../cache/ticket.cache'); // à créer comme event/offer

async function readTicketService(id) {
  const t = timer('readTicketService').start();
  try {
    // Lecture cache
    const cached = await getCachedTicket(id);
    if (cached) {
      logger.info(`[cache] Ticket ${id} trouvé en cache`);
      t.success();
      return cached;
    }

    // Lecture DB
    const ticket = await prisma.ticket.findUnique({
      where: { id: parseInt(id) },
      include: {
        event: true,
        offer: true
      }
    });

    if (ticket) {
      await cacheTicket(ticket);
      logger.info(`[cache] Ticket ${id} mis en cache`);
    }

    t.success();
    return ticket;
  } catch (err) {
    t.fail(err);
    logger.error(`[ticket] Erreur lecture ticket ${id}: ${err.message}`);
    throw err;
  }
}

module.exports = { readTicketService };
