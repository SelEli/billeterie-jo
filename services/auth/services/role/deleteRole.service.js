// services/role/deleteRole.service.js
const { prisma, logger, publishKafkaEvent } = require('../../utils');

async function deleteRoleService(userId) {
  try {
    logger.debug(`[ROLE][DELETE] Resetting role for user id=${userId}`);

    const parsedId = Number(userId);
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      return { error: 'INVALID_ROLE_ID' };
    }

    const existingUser = await prisma.user.findUnique({ where: { id: parsedId } });
    if (!existingUser) {
      return null;
    }

    let updated;
    try {
      updated = await prisma.user.update({
        where: { id: parsedId },
        data: { role: 'VISITOR' }
      });
    } catch (err) {
      throw err;
    }

    try {
      await publishKafkaEvent('role.deleted', { userId: parsedId, oldRole: existingUser.role });
    } catch (err) {
      logger.warn(`[ROLE][DELETE] Kafka publish skipped: ${err.message}`);
    }

    return updated;
  } catch (err) {
    logger.error(`[ROLE][DELETE] Service error: ${err.message}`);
    throw err;
  }
}

module.exports = { deleteRoleService };
