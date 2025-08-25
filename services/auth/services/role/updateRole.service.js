// services/role/updateRole.service.js
const { prisma, logger, publishKafkaEvent } = require('../../utils');

async function updateRoleService(userId, newRole) {
  try {
    logger.debug(`[ROLE][UPDATE] Updating role for user id=${userId}`);

    const parsedId = Number(userId);
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      return { error: 'INVALID_ROLE_ID' };
    }

    if (!newRole) {
      return { error: 'ROLE_REQUIRED' };
    }

    const validRoles = ['ADMIN', 'AGENT', 'USER', 'VISITOR', 'EMPLOYEE'];
    if (typeof newRole === 'string' && !validRoles.includes(newRole.toUpperCase())) {
      return { error: 'INVALID_ROLE' };
    }

    const existingUser = await prisma.user.findUnique({ where: { id: parsedId } });
    if (!existingUser) {
      return null;
    }

    let updated;
    try {
      updated = await prisma.user.update({
        where: { id: parsedId },
        data: { role: newRole.toUpperCase() }
      });
    } catch (err) {
      if (err.message?.includes('Invalid enum value')) return { error: 'INVALID_ROLE' };
      if (err.message?.includes('Required')) return { error: 'ROLE_REQUIRED' };
      throw err;
    }

    try {
      await publishKafkaEvent('role.updated', { userId: parsedId, newRole: updated.role });
    } catch (err) {
      logger.warn(`[ROLE][UPDATE] Kafka publish skipped: ${err.message}`);
    }

    return updated;
  } catch (err) {
    logger.error(`[ROLE][UPDATE] Service error: ${err.message}`);
    throw err;
  }
}

module.exports = { updateRoleService };
