const prisma = require('../../utils/prismaClient');
const { timer } = require('../../monitor/monitor');
const logger = require('../../utils/logger');
const { cacheTicket, getCachedTicket } = require('../../cache/ticket.cache');
const { ERROR_STATUS } = require('../../utils/httpErrorMap');
const axios = require('axios');

/**
 * Lecture d'un ticket par ID, avec cache Redis.
 * @param {number|string} id - ID du ticket
 * @param {string} authHeader - Authorization header pour vérifier l'utilisateur
 * @param {object} [options] - Options
 * @param {boolean} [options.noCache=false] - Si true, ignore le cache et lit directement la BDD
 * @param {boolean} [options.includeSecret=false] - Si true, inclut secretKey (usage interne uniquement)
 */
async function readTicketService(id, authHeader, { noCache = false, includeSecret = false } = {}) {
  const t = timer('readTicketService').start();

  const numericId = parseInt(id, 10);
  if (Number.isNaN(numericId)) {
    const err = new Error('INVALID_TICKET_ID');
    err.statusCode = ERROR_STATUS.INVALID_TICKET_ID;
    throw err;
  }

  try {
    // 1. Lecture cache (sauf si noCache ou si includeSecret)
    if (!noCache && !includeSecret) {
      const cached = await getCachedTicket(numericId);
      if (cached) {
        logger.info(`[cache] Ticket ${numericId} trouvé en cache`);
        t.success();
        return cached;
      }
    }

    // 2. Lecture DB
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
        offer: true,
        ...(includeSecret ? { secretKey: true } : {}) // 🔹 secretKey seulement si demandé
      }
    });

    if (!ticket) {
      const err = new Error('TICKET_NOT_FOUND');
      err.statusCode = ERROR_STATUS.TICKET_NOT_FOUND;
      throw err;
    }

    // 3. Vérification utilisateur via Auth (non bloquante)
    try {
      const res = await axios.get(`${process.env.AUTH_URL}/user/${ticket.userId}`, {
        headers: { Authorization: authHeader }
      });
      if (!res.data || !res.data.data) {
        logger.warn(`[TICKET SERVICE] User ${ticket.userId} not found in Auth`);
      }
    } catch (err) {
      logger.warn(`[TICKET SERVICE] Auth check failed: ${err.message}`);
    }

    // 4. Mise en cache (seulement si pas includeSecret)
    if (!includeSecret) {
      await cacheTicket(ticket);
      logger.info(`[cache] Ticket ${numericId} mis en cache`);
    }

    t.success();
    return ticket;
  } catch (err) {
    t.fail(err);
    logger.error(`[ticket] Erreur lecture ticket ${numericId}: ${err.message}`);
    throw err;
  }
}

module.exports = { readTicketService };
