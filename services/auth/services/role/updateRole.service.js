// services/role/updateRole.service.js
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
      : (Object.prototype.hasOwnProperty.call(payload || {}, 'name')
          ? payload.name
          : payload?.role);

    if (roleValue === undefined) {
      logger.warn(`[ROLE][UPDATE] Role not provided for update [id=${parsedId}]`);
      return { error: 'ROLE_REQUIRED' };
    }

    if (typeof roleValue === 'string') {
      const normalizedRole = roleValue.toUpperCase();
      const validRoles = ['ADMIN', 'AGENT', 'USER', 'VISITOR'];
      if (!validRoles.includes(normalizedRole)) {
        logger.warn(`[ROLE][UPDATE] Invalid role name attempted: ${roleValue}`);
        return { error: 'INVALID_ROLE' };
      }
      // on normalise pour l'enregistrement
      payload = normalizedRole;
    }

    const existing = await prisma.role.findUnique({ where: { id: parsedId } });
    if (!existing) {
      logger.warn(`[ROLE][UPDATE] Role not found [id=${parsedId}]`);
      return null;
    }

    let updated;
    try {
      updated = await prisma.role.update({
        where: { id: parsedId },
        data: { name: payload }
      });
    } catch (err) {
      if (err.code === 'P2002') {
        logger.warn(`[ROLE][UPDATE] Unique constraint violation for role: ${payload}`);
        return { error: 'ROLE_EXISTS' };
      }
      throw err;
    }

    logger.info(`[ROLE][UPDATE] Role updated [id=${parsedId}] → ${payload}`);

    try {
      await publishKafkaEvent('role.updated', { roleId: parsedId, newName: payload });
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
