const prisma = require('../../utils/prismaClient');
const logger = require('../../utils/logger');

/**
 * Liste paginée des tickets avec filtres
 */
async function listTicketsService(filters = {}) {
  try {
    logger.debug('[TICKET SERVICE] Fetching tickets list');

    const where = {};

    // Filtre par userId
    if (filters.userId) {
      const userId = Number(filters.userId);
      if (Number.isNaN(userId)) {
        const err = new Error('INVALID_USER_ID');
        err.statusCode = ERROR_STATUS.INVALID_USER_ID;
        throw err;
      }
      where.userId = userId;
    }

    // Filtre par status
    if (filters.status) {
      const validStatuses = ['RESERVED', 'VALID', 'CANCELLED', 'USED', 'EXPIRED'];
      if (!validStatuses.includes(filters.status)) {
        const err = new Error('INVALID_TICKET_STATUS');
        err.statusCode = ERROR_STATUS.INVALID_TICKET_STATUS;
        throw err;
      }
      where.status = filters.status;
    }

    // Pagination
    const limit = Number(filters.limit) > 0 ? Number(filters.limit) : 10;
    const page = Number(filters.page) > 0 ? Number(filters.page) : 1;
    const skip = (page - 1) * limit;

    // Tri dynamique si fourni
    let orderBy = { id: 'asc' };
    if (filters.sortBy) {
      orderBy = {
        [filters.sortBy]: filters.order && filters.order.toLowerCase() === 'desc' ? 'desc' : 'asc'
      };
    }

    // Requête + total en parallèle
    const [tickets, total] = await Promise.all([
      prisma.ticket.findMany({
        where,
        orderBy,
        take: limit,
        skip,
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
          signature: true
        }
      }),
      prisma.ticket.count({ where })
    ]);

    logger.info(`[TICKET SERVICE] Retrieved ${tickets.length} ticket(s) on page ${page}`);

    return {
      tickets,
      pagination: {
        page,
        limit,
        total
      }
    };
  } catch (err) {
    logger.error(`[TICKET SERVICE] Service error: ${err.message}`);
    throw err;
  }
}

module.exports = { listTicketsService };
