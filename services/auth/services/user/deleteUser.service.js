const { prisma, logger } = require('../../utils');

const deleteUserService = async (id) => {
  try {
    logger.debug(`[USER][DELETE] Deleting user [id=${id}]`);

    const parsedId = Number(id);
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      logger.warn(`[USER][DELETE] Invalid user ID: ${id}`);
      return { error: 'INVALID_USER_ID' };
    }

    let deleted;
    try {
      deleted = await prisma.user.delete({ where: { id: parsedId } });
    } catch {
      deleted = null;
    }

    if (!deleted) {
      logger.warn(`[USER][DELETE] User not found [id=${parsedId}]`);
      return null;
    }

    logger.info(`[USER][DELETE] User deleted [id=${parsedId}]`);
    return deleted;
  } catch (err) {
    logger.error(`[USER][DELETE] Service error: ${err.message}`);
    throw err;
  }
};

module.exports = { deleteUserService };
