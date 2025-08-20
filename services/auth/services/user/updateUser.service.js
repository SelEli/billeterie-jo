const { prisma, logger } = require('../../utils');

const updateUserService = async (id, data) => {
  logger.debug(`[USER][UPDATE] Updating user [id=${id}]`);

  let user = null;
  try {
    user = await prisma.user.update({
      where: { id: parseInt(id, 10) },
      data
    });
  } catch {
    user = null;
  }

  if (!user) {
    logger.warn(`[USER][UPDATE] User not found [id=${id}]`);
    return null;
  }

  logger.info(`[USER][UPDATE] User updated [id=${user.id}]`);
  return user;
};

module.exports = { updateUserService };
