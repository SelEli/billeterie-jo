const { prisma, logger, publishKafkaEvent } = require('../../utils');

async function deleteRoleService(roleId) {
  const id = parseInt(roleId, 10);
  const role = await prisma.role.findUnique({ where: { id } });
  if (!role) return null;

  await prisma.role.delete({ where: { id } });
  logger.info(`Role deleted: ${role.name}`);
  await publishKafkaEvent('role.deleted', { roleId: id, name: role.name });

  return true;
}

module.exports = { deleteRoleService };
