// services/role/listRoles.service.js
const { prisma, logger } = require('../../utils');

async function listRolesService() {
  try {
    logger.debug('[ROLE][LIST] Listing distinct roles from users');

    const roles = await prisma.user.findMany({
      distinct: ['role'],
      select: { role: true }
    });

    if (!roles || roles.length === 0) {
      return { error: 'NO_ROLES_FOUND' };
    }

    return roles.map(r => r.role);
  } catch (err) {
    logger.error(`[ROLE][LIST] Service error: ${err.message}`);
    throw err;
  }
}

module.exports = { listRolesService };
