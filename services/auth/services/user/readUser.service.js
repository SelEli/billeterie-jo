// services/user/readUser.service.js
const { prisma, logger } = require('../../utils');

const readUserService = async (id) => {
  try {
    const userId = Number(id);
    if (!Number.isInteger(userId) || userId <= 0) {
      logger.warn(`[USER][READ] Invalid user ID: ${id}`);
      return { error: 'INVALID_USER_ID' };
    }

    logger.debug(`[USER][READ] Fetching user [id=${userId}]`);

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      logger.warn(`[USER][READ] User not found [id=${userId}]`);
      return null;
    }

    logger.info(`[USER][READ] Found user [id=${user.id}]`);
    return user;
  } catch (err) {
    logger.error(`[USER][READ] Service error: ${err.message}`);
    throw err;
  }
};

module.exports = { readUserService };
