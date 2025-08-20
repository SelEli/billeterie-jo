const { prisma, logger, publishKafkaEvent } = require('../../utils');

async function updateRoleService(userId, role) {
  const id = parseInt(userId, 10);
  if (isNaN(id)) {
    logger.warn(`Invalid user ID: ${userId}`);
    throw new Error('INVALID_ID');
  }

  if (!role) {
    logger.warn(`Role not provided for user update [id=${id}]`);
    throw new Error('ROLE_REQUIRED');
  }

  const normalizedRole = role.toUpperCase();
  const validRoles = ['ADMIN', 'AGENT', 'USER', 'VISITOR'];
  if (!validRoles.includes(normalizedRole)) {
    logger.warn(`Invalid role assignment attempted: ${role}`);
    throw new Error('INVALID_ROLE');
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return null;

  if (user.role === 'VISITOR' && normalizedRole !== 'USER') {
    logger.warn(`Visitor role cannot be elevated beyond user [id=${id}]`);
    throw new Error('VISITOR_RESTRICTED');
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { role: normalizedRole }
  });

  logger.info(`Role updated for user [id=${id}] → ${normalizedRole}`);
  await publishKafkaEvent('user.role_updated', { userId: id, newRole: normalizedRole });

  return updated;
}

module.exports = { updateRoleService };
