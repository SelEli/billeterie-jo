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

    logger.info(`[ROLE][LIST] Retrieved ${roles.length} role(s)`);
    return roles;
  } catch (err) {
    logger.error(`[ROLE][LIST] Error: ${err.message}`);
    throw err;
  }
}

module.exports = { listRolesService };
