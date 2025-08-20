const { prisma, logger, publishKafkaEvent } = require('../../utils');

async function createRoleService(data) {
  const { name, permissions } = data;

  const existing = await prisma.role.findUnique({ where: { name } });
  if (existing) return null;

  const role = await prisma.role.create({ data: { name, permissions } });

  logger.info(`Role created: ${role.name}`);
  await publishKafkaEvent('role.created', { roleId: role.id, name: role.name });

  return role;
}

module.exports = { createRoleService };
