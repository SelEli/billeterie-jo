// services/role/deleteRole.service.js
const { prisma, logger, publishKafkaEvent } = require('../../utils');

async function deleteRoleService(roleId) {
  try {
    logger.debug(`[ROLE][DELETE] Request to delete role id=${roleId}`);

    const parsedId = Number(roleId);
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      logger.warn(`[ROLE][DELETE] Invalid role ID: ${roleId}`);
      return { error: 'INVALID_ROLE_ID' };
    }

    const existing = await prisma.role.findUnique({ where: { id: parsedId } });
    if (!existing) {
      logger.warn(`[ROLE][DELETE] Role not found [id=${parsedId}]`);
      return null;
    }

    const deleted = await prisma.role.delete({ where: { id: parsedId } });
    logger.info(`[ROLE][DELETE] Role deleted: ${deleted.name} (id=${parsedId})`);

    try {
      await publishKafkaEvent('role.deleted', { roleId: parsedId, name: deleted.name });
    } catch (err) {
      logger.warn(`[ROLE][DELETE] Kafka publish skipped: ${err.message}`);
    }

    return deleted;
  } catch (err) {
    logger.error(`[ROLE][DELETE] Service error: ${err.message}`);
    throw err;
  }
}

module.exports = { deleteRoleService };
