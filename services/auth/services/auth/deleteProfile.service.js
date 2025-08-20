const { prisma, logger, publishKafkaEvent } = require('../../utils');

async function deleteProfileService(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return null;

  await prisma.user.delete({ where: { id: userId } });
  logger.info(`User self-deleted [id=${userId}]`);
  await publishKafkaEvent('user.deleted', { userId });

  return true;
}

module.exports = { deleteProfileService };
