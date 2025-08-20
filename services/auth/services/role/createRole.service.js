// services/role/createRole.service.js
const { prisma, logger, publishKafkaEvent } = require('../../utils');

async function createRoleService(data) {
  try {
    const { name, permissions } = data;

    logger.debug(`[ROLE][CREATE] Requested creation of role: ${name}`);

    // Vérifier si le rôle existe déjà
    const existing = await prisma.role.findUnique({ where: { name } });
    if (existing) {
      logger.warn(`[ROLE][CREATE] Role already exists: ${name}`);
      return null;
    }

    // Création du rôle
    const role = await prisma.role.create({ data: { name, permissions } });
    logger.info(`[ROLE][CREATE] Role created: ${role.name} (id=${role.id})`);

    // Publication événement Kafka (protégé)
    try {
      await publishKafkaEvent('role.created', { roleId: role.id, name: role.name });
    } catch (err) {
      logger.warn(`[ROLE][CREATE] Kafka publish skipped: ${err.message}`);
    }

    return role;
  } catch (err) {
    logger.error(`[ROLE][CREATE] Error: ${err.message}`);
    throw err;
  }
}

module.exports = { createRoleService };
