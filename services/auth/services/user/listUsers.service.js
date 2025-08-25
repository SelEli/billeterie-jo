// services/user/listUsers.service.js
const { prisma, logger } = require('../../utils');

const listUsersService = async (filters = {}) => {
  try {
    logger.debug('[USER][LIST] Fetching users list');

    const where = {};

    // Recherche partielle par email
    if (filters.email) {
      where.email = {
        contains: String(filters.email).trim().toLowerCase(),
        mode: 'insensitive'
      };
    }

    // Filtre par rôle
    if (filters.role) {
      const validRoles = ['ADMIN', 'AGENT', 'USER', 'VISITOR', 'EMPLOYEE'];
      if (!validRoles.includes(filters.role)) {
        logger.warn(`[USER][LIST] Invalid role filter: ${filters.role}`);
        return { error: 'INVALID_ROLE' };
      }
      where.role = filters.role;
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

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy,
        take: limit,
        skip,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          birthDate: true,
          role: true,
          invisibleKey: true,
          lastLogin: true,
          isBlacklisted: true,
          blacklistReason: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      prisma.user.count({ where })
    ]);

    logger.info(`[USER][LIST] Retrieved ${users.length} user(s) on page ${page}`);

    return {
      users,
      pagination: {
        page,
        limit,
        total
      }
    };
  } catch (err) {
    logger.error(`[USER][LIST] Service error: ${err.message}`);
    throw err;
  }
};

module.exports = { listUsersService };

