const prisma = require('../../utils/prismaClient');
const logger = require('../../utils/logger');
const { ERROR_STATUS } = require('../../utils/httpErrorMap');

async function listTicketsService(filters = {}) {
  try {
    logger.debug('[TICKET SERVICE] Fetching tickets list');

    const where = {};

    if (filters.userId) {
      const userId = Number(filters.userId);
      if (Number.isNaN(userId)) {
        const err = new Error('INVALID_USER_ID');
        err.statusCode = ERROR_STATUS.INVALID_USER_ID;
        throw err;
      }
      where.userId = userId;
    }

    if (filters.status) {
      const validStatuses = ['RESERVED', 'VALID', 'CANCELLED', 'USED', 'EXPIRED'];
      if (!validStatuses.includes(filters.status)) {
        const err = new Error('INVALID_TICKET_STATUS');
        err.statusCode = ERROR_STATUS.INVALID_TICKET_STATUS;
        throw err;
      }
      where.status = filters.status;
    }

    const limit = Number(filters.limit) > 0 ? Number(filters.limit) : 10;
    const page = Number(filters.page) > 0 ? Number(filters.page) : 1;
    const skip = (page - 1) * limit;

    let orderBy = { id: 'asc' };
    if (filters.sortBy) {
      orderBy = {
        [filters.sortBy]: filters.order && filters.order.toLowerCase() === 'desc' ? 'desc' : 'asc'
      };
    }

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
