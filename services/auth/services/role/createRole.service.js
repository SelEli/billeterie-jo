// services/role/createRole.service.js
const { prisma, logger, publishKafkaEvent } = require('../../utils');

async function createRoleService(data) {
  try {
    const { name, permissions } = data || {};
    logger.debug(`[ROLE][CREATE] Requested creation of role: ${name}`);

    if (!name || typeof name !== 'string' || !name.trim()) {
      logger.warn('[ROLE][CREATE] Missing or invalid role name');
      return { error: 'ROLE_NAME_REQUIRED' };
    }

    if (permissions && !Array.isArray(permissions)) {
      logger.warn('[ROLE][CREATE] Invalid permissions format');
      return { error: 'INVALID_PERMISSIONS' }; // à ajouter dans ERROR_STATUS si utilisé
    }

    const existing = await prisma.role.findUnique({ where: { name: name.trim() } });
    if (existing) {
      logger.warn(`[ROLE][CREATE] Role already exists: ${name}`);
      return { error: 'ROLE_EXISTS' };
    }

    let role;
    try {
      role = await prisma.role.create({
        data: { name: name.trim(), permissions }
      });
    } catch (err) {
      if (err.code === 'P2002') {
        logger.warn(`[ROLE][CREATE] Unique constraint violation for role: ${name}`);
        return { error: 'ROLE_EXISTS' };
      }
      throw err;
    }

    logger.info(`[ROLE][CREATE] Role created: ${role.name} (id=${role.id})`);

    try {
      await publishKafkaEvent('role.created', { roleId: role.id, name: role.name });
    } catch (err) {
      logger.warn(`[ROLE][CREATE] Kafka publish skipped: ${err.message}`);
    }

    return role;
  } catch (err) {
    logger.error(`[ROLE][CREATE] Service error: ${err.message}`);
    throw err;
  }
}

module.exports = { createRoleService };
