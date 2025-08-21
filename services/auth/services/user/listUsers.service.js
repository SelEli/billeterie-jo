const { prisma, logger } = require('../../utils');

const listUsersService = async (filters = {}) => {
  try {
    logger.debug('[USER][LIST] Fetching users list');

    const where = {};
    if (filters.email) {
      where.email = { contains: filters.email, mode: 'insensitive' };
    }
    if (filters.role) {
      where.role = filters.role;
    }

    const users = await prisma.user.findMany({
      where,
      orderBy: { id: 'asc' }
    });

    if (!users || users.length === 0) {
      logger.warn('[USER][LIST] No users found');
      return { error: 'NO_USERS_FOUND' };
    }

    logger.info(`[USER][LIST] Retrieved ${users.length} user(s)`);
    return users;
  } catch (err) {
    logger.error(`[USER][LIST] Service error: ${err.message}`);
    throw err;
  }
};

module.exports = { listUsersService };
