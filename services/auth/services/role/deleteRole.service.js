// services/role/deleteRole.service.js
const { prisma, logger, publishKafkaEvent } = require('../../utils');

async function deleteRoleService(roleId) {
  try {
    const id = parseInt(roleId, 10);
    if (isNaN(id)) {
      logger.warn(`[ROLE][DELETE] Invalid role ID: ${roleId}`);
      throw new Error('INVALID_ID');
    }

    logger.debug(`[ROLE][DELETE] Request to delete role id=${id}`);

    // On tente directement la suppression pour coller aux tests unitaires
    try {
      const deleted = await prisma.role.delete({ where: { id } });
      logger.info(`[ROLE][DELETE] Role deleted: ${deleted.name} (id=${id})`);

      try {
        await publishKafkaEvent('role.deleted', { roleId: id, name: deleted.name });
      } catch (err) {
        logger.warn(`[ROLE][DELETE] Kafka publish skipped: ${err.message}`);
      }

      return deleted; // Les tests attendent l'objet supprimé
    } catch (err) {
      logger.warn(`[ROLE][DELETE] Delete failed for role id=${id}: ${err.message}`);
      throw err; // Laisser remonter pour que .rejects dans les tests fonctionne
    }
  } catch (err) {
    logger.error(`[ROLE][DELETE] Error: ${err.message}`);
    throw err;
  }
}

module.exports = { deleteRoleService };
