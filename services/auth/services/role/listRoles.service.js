// services/role/listRoles.service.js
const { prisma, logger } = require('../../utils');

async function listRolesService(filters = {}) {
  try {
    logger.debug('[ROLE][LIST] Fetching roles list');

    const where = {};
    if (filters.name) {
      where.name = { contains: filters.name, mode: 'insensitive' };
    }

    const roles = await prisma.role.findMany({
      where,
      orderBy: { name: 'asc' }
    });

    if (!roles || roles.length === 0) {
      logger.warn('[ROLE][LIST] No roles found');
      return { error: 'NO_ROLES_FOUND' };
    }

    logger.info(`[ROLE][LIST] Retrieved ${roles.length} role(s)`);
    return roles;
  } catch (err) {
    logger.error(`[ROLE][LIST] Service error: ${err.message}`);
    throw err;
  }
}

module.exports = { listRolesService };
