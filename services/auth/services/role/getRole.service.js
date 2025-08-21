// services/role/getRole.service.js
const { prisma, logger } = require('../../utils');

async function getRoleService(roleId) {
  try {
    logger.debug(`[ROLE][GET] Fetching role id=${roleId}`);

    const parsedId = Number(roleId);
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      logger.warn(`[ROLE][GET] Invalid role ID: ${roleId}`);
      return { error: 'INVALID_ID' };
    }

    const role = await prisma.role.findUnique({ where: { id: parsedId } });
    if (!role) {
      logger.warn(`[ROLE][GET] Role not found [id=${parsedId}]`);
      return null;
    }

    return role;
  } catch (err) {
    logger.error(`[ROLE][GET] Service error: ${err.message}`);
    throw err;
  }
}

module.exports = { getRoleService };
