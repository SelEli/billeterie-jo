// services/ticket/readTicket.service.js
const prisma = require('../../utils/prismaClient');
const { timer } = require('../../monitor/monitor');
const logger = require('../../utils/logger');
const { cacheTicket, getCachedTicket } = require('../../cache/ticket.cache');
const { ERROR_STATUS } = require('../../utils/httpErrorMap');
const axios = require('axios');

async function readTicketService(id, authHeader) {
  const t = timer('readTicketService').start();

  const numericId = parseInt(id, 10);
  if (Number.isNaN(numericId)) {
    const err = new Error('INVALID_TICKET_ID');
    err.statusCode = ERROR_STATUS.INVALID_TICKET_ID;
    throw err;
  }

  try {
    // Lecture cache
    const cached = await getCachedTicket(numericId);
    if (cached) {
      logger.info(`[cache] Ticket ${numericId} trouvé en cache`);
      t.success();
      return cached;
    }

    // Lecture DB sans secretKey ni jointure User
    const ticket = await prisma.ticket.findUnique({
      where: { id: numericId },
      select: {
        id: true,
        price: true,
        zone: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
        eventId: true,
        offerId: true,
        signature: true,
        event: true,
        offer: true
      }
    });

    if (!ticket) {
      const err = new Error('TICKET_NOT_FOUND');
      err.statusCode = ERROR_STATUS.TICKET_NOT_FOUND;
      throw err;
    }

    // Optionnel : vérifier l'utilisateur via Auth
    try {
      const res = await axios.get(`${process.env.AUTH_SERVICE_URL}/user/${ticket.userId}`, {
        headers: { Authorization: authHeader }
      });
      if (!res.data || !res.data.data) {
        logger.warn(`[TICKET SERVICE] User ${ticket.userId} not found in Auth`);
      }
    } catch (err) {
      logger.warn(`[TICKET SERVICE] Auth check failed: ${err.message}`);
    }

    await cacheTicket(ticket);
    logger.info(`[cache] Ticket ${numericId} mis en cache`);

    t.success();
    return ticket;
  } catch (err) {
    t.fail(err);
    logger.error(`[ticket] Erreur lecture ticket ${numericId}: ${err.message}`);
    throw err;
  }
}

module.exports = { readTicketService };
