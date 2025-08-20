const { prisma, logger } = require('../../utils');

const readUserService = async (id) => {
  logger.debug(`[USER][READ] Fetching user [id=${id}]`);
  const user = await prisma.user.findUnique({ where: { id: parseInt(id, 10) } });
  if (!user) {
    logger.warn(`[USER][READ] User not found [id=${id}]`);
    return null;
  }
  logger.info(`[USER][READ] Found user [id=${user.id}]`);
  return user;
};

module.exports = { readUserService };
