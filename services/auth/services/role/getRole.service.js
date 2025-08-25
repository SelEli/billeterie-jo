// services/role/getRole.service.js
const { prisma, logger } = require('../../utils');

async function getRoleService(userId) {
  try {
    logger.debug(`[ROLE][GET] Fetching role for user id=${userId}`);

    const parsedId = Number(userId);
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      return { error: 'INVALID_ROLE_ID' };
    }

    const user = await prisma.user.findUnique({
      where: { id: parsedId },
      select: { role: true }
    });

    if (!user) {
      return null;
    }

    return { id: parsedId, role: user.role };
  } catch (err) {
    logger.error(`[ROLE][GET] Service error: ${err.message}`);
    throw err;
  }
}

module.exports = { getRoleService };
