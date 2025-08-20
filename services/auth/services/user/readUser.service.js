// services/user/readUser.service.js
const { prisma, logger } = require('../../utils');

const readUserService = async (id) => {
  try {
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      logger.warn(`[USER][READ] Invalid user ID: ${id}`);
      throw new Error('INVALID_ID');
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
    logger.error(`[USER][READ] Error: ${err.message}`);
    throw err;
  }
};

module.exports = { readUserService };
