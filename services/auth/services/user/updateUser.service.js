const { prisma, logger } = require('../../utils');

const updateUserService = async (id, data) => {
  try {
    const userId = Number(id);
    if (!Number.isInteger(userId) || userId <= 0) {
      logger.warn(`[USER][UPDATE] Invalid user ID: ${id}`);
      return { error: 'INVALID_USER_ID' };
    }

    logger.debug(`[USER][UPDATE] Updating user [id=${userId}] with data: ${JSON.stringify(data)}`);

    let user;
    try {
      user = await prisma.user.update({
        where: { id: userId },
        data
      });
    } catch {
      logger.warn(`[USER][UPDATE] User not found [id=${userId}]`);
      return null;
    }

    logger.info(`[USER][UPDATE] User updated [id=${user.id}]`);
    return user;
  } catch (err) {
    logger.error(`[USER][UPDATE] Service error: ${err.message}`);
    throw err;
  }
};

module.exports = { updateUserService };
