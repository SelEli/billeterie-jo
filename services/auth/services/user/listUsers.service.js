const { prisma, logger } = require('../../utils');

/**
 * Récupère la liste des utilisateurs avec filtres optionnels.
 * @param {Object} filters - ex: { email, role }
 */
const listUsersService = async (filters = {}) => {
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

  logger.info(`[USER][LIST] Retrieved ${users.length} user(s)`);
  return users;
};

module.exports = { listUsersService };
