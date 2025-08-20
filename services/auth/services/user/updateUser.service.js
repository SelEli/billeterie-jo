// services/user/updateUser.service.js
const { prisma, logger } = require('../../utils');

const updateUserService = async (id, data) => {
  try {
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      logger.warn(`[USER][UPDATE] Invalid user ID: ${id}`);
      throw new Error('INVALID_ID');
    }

    logger.debug(`[USER][UPDATE] Updating user [id=${userId}] with data: ${JSON.stringify(data)}`);

    let user;
    try {
      user = await prisma.user.update({
        where: { id: userId },
        data
      });
    } catch (err) {
      // Cas "not found" → Prisma jette, on capture et on renvoie null
      logger.warn(`[USER][UPDATE] User not found [id=${userId}]`);
      return null;
    }

    logger.info(`[USER][UPDATE] User updated [id=${user.id}]`);
    return user;
  } catch (err) {
    logger.error(`[USER][UPDATE] Error: ${err.message}`);
    throw err;
  }
};

module.exports = { updateUserService };
