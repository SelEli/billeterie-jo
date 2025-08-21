const { prisma, logger, publishKafkaEvent } = require('../../utils');

async function updateRoleService(roleId, payload) {
  try {
    logger.debug(`[ROLE][UPDATE] Updating role id=${roleId}`);

    const parsedId = Number(roleId);
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      logger.warn(`[ROLE][UPDATE] Invalid role ID: ${roleId}`);
      return { error: 'INVALID_ROLE_ID' };
    }

    const roleValue = typeof payload === 'string'
      ? payload
      : payload?.name || payload?.role;

    if (typeof roleValue !== 'string') {
      logger.warn(`[ROLE][UPDATE] Role not provided or invalid for role update [id=${parsedId}]`);
      return { error: 'ROLE_REQUIRED' };
    }

    const normalizedRole = roleValue.toUpperCase();
    const validRoles = ['ADMIN', 'AGENT', 'USER', 'VISITOR'];
    if (!validRoles.includes(normalizedRole)) {
      logger.warn(`[ROLE][UPDATE] Invalid role name attempted: ${roleValue}`);
      return { error: 'INVALID_ROLE' };
    }

    const existing = await prisma.role.findUnique({ where: { id: parsedId } });
    if (!existing) {
      logger.warn(`[ROLE][UPDATE] Role not found [id=${parsedId}]`);
      return null; // contrôleur traduira en ROLE_NOT_FOUND
    }

    const updated = await prisma.role.update({
      where: { id: parsedId },
      data: { name: normalizedRole }
    });

    logger.info(`[ROLE][UPDATE] Role updated [id=${parsedId}] → ${normalizedRole}`);

    try {
      await publishKafkaEvent('role.updated', { roleId: parsedId, newName: normalizedRole });
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
