// services/role/createRole.service.js
const { prisma, logger, publishKafkaEvent } = require('../../utils');

async function createRoleService({ userId, role }) {
  try {
    logger.debug(`[ROLE][CREATE] Assigning role ${role} to user ${userId}`);

    const parsedId = Number(userId);
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      return { error: 'INVALID_ROLE_ID' };
    }

    if (!role) {
      return { error: 'ROLE_REQUIRED' };
    }

    const validRoles = ['ADMIN', 'AGENT', 'USER', 'VISITOR', 'EMPLOYEE'];
    if (typeof role === 'string' && !validRoles.includes(role.toUpperCase())) {
      return { error: 'INVALID_ROLE' };
    }

    const existingUser = await prisma.user.findUnique({ where: { id: parsedId } });
    if (!existingUser) {
      return { error: 'USER_NOT_FOUND' };
    }

    let updated;
    try {
      updated = await prisma.user.update({
        where: { id: parsedId },
        data: { role: role.toUpperCase() }
      });
    } catch (err) {
      if (err.message?.includes('Invalid enum value')) return { error: 'INVALID_ROLE' };
      if (err.message?.includes('Required')) return { error: 'ROLE_REQUIRED' };
      throw err;
    }

    // Kafka non bloquant
    try {
      await publishKafkaEvent('user', {
        type: 'UserUpdated',
        userId: updated.id,
        email: updated.email,
        firstName: updated.firstName,
        lastName: updated.lastName,
        role: updated.role,
        invisibleKey: updated.invisibleKey
      });
      logger.debug('[ROLE][CREATE] Kafka event published');
    } catch (err) {
      logger.warn(`[ROLE][CREATE] Kafka publish skipped: ${err.message}`);
    }

    return updated;
  } catch (err) {
    logger.error(`[ROLE][CREATE] Service error: ${err.message}`, { stack: err.stack });
    throw err;
  }
}

module.exports = { createRoleService };
