// services/role/listRole.service.js
const { prisma, logger } = require('../../utils');

async function listRolesService(filters = {}) {
  logger.debug('[ROLE][LIST] Fetching roles list');

  // Exemple : possibilité de filtrer par nom ou autres champs
  const where = {};
  if (filters.name) {
    where.name = { contains: filters.name, mode: 'insensitive' };
  }

  const roles = await prisma.role.findMany({ where, orderBy: { name: 'asc' } });
  logger.info(`[ROLE][LIST] Retrieved ${roles.length} role(s)`);

  return roles;
}

module.exports = { listRolesService };
