// services/role/getRole.service.js
const { prisma, logger } = require('../../utils');

async function getRoleService(roleId) {
  try {
    const id = parseInt(roleId, 10);
    logger.debug(`[ROLE][GET] Fetching role id=${id}`);

    return await prisma.role.findUnique({ where: { id } });
  } catch (err) {
    logger.error(`[ROLE][GET] Error: ${err.message}`);
    throw err;
  }
}

module.exports = { getRoleService };
