// services/role/updateRole.service.js
const { prisma, logger, publishKafkaEvent } = require('../../utils');

async function updateRoleService(userId, payload) {
  try {
    const id = parseInt(userId, 10);
    if (isNaN(id)) {
      logger.warn(`[ROLE][UPDATE] Invalid user ID: ${userId}`);
      throw new Error('INVALID_ID');
    }

    // Récupération de la valeur du rôle depuis payload ou direct string
    const roleValue = typeof payload === 'string' ? payload : payload?.name || payload?.role;
    if (typeof roleValue !== 'string') {
      logger.warn(`[ROLE][UPDATE] Role not provided or invalid for user update [id=${id}]`);
      throw new Error('ROLE_REQUIRED');
    }

    const normalizedRole = roleValue.toUpperCase();
    const validRoles = ['ADMIN', 'AGENT', 'USER', 'VISITOR'];
    if (!validRoles.includes(normalizedRole)) {
      logger.warn(`[ROLE][UPDATE] Invalid role assignment attempted: ${roleValue}`);
      throw new Error('INVALID_ROLE');
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      logger.warn(`[ROLE][UPDATE] User not found [id=${id}]`);
      return null;
    }

    if (user.role === 'VISITOR' && normalizedRole !== 'USER') {
      logger.warn(`[ROLE][UPDATE] Visitor role cannot be elevated beyond USER [id=${id}]`);
      throw new Error('VISITOR_RESTRICTED');
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { role: normalizedRole }
    });

    logger.info(`[ROLE][UPDATE] Role updated for user [id=${id}] → ${normalizedRole}`);

    // Événement Kafka non bloquant
    try {
      await publishKafkaEvent('user.role_updated', { userId: id, newRole: normalizedRole });
    } catch (err) {
      logger.warn(`[ROLE][UPDATE] Kafka publish skipped: ${err.message}`);
    }

    return updated;
  } catch (err) {
    logger.error(`[ROLE][UPDATE] Error: ${err.message}`);
    throw err;
  }
}

module.exports = { updateRoleService };
