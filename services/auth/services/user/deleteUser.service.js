// services/user/deleteUser.service.js
const { prisma, logger, publishKafkaEvent } = require('../../utils');

const deleteUserService = async (id) => {
  try {
    logger.debug(`[USER][DELETE] Deleting user [id=${id}]`);

    const parsedId = Number(id);
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      logger.warn(`[USER][DELETE] Invalid user ID: ${id}`);
      return { error: 'INVALID_USER_ID' };
    }

    const existing = await prisma.user.findUnique({ where: { id: parsedId } });
    if (!existing) {
      logger.warn(`[USER][DELETE] User not found [id=${parsedId}]`);
      return null;
    }

    const deleted = await prisma.user.delete({ where: { id: parsedId } });
    logger.info(`[USER][DELETE] User deleted [id=${deleted.id}]`);

    // Kafka non bloquant
    try {
      await publishKafkaEvent('user', {
        type: 'UserDeleted',
        userId: deleted.id
      });
      logger.debug('[USER][DELETE] Kafka event published');
    } catch (err) {
      logger.warn(`[USER][DELETE] Kafka publish skipped: ${err.message}`);
    }

    return deleted;
  } catch (err) {
    logger.error(`[USER][DELETE] Service error: ${err.message}`);
    throw err;
  }
};

module.exports = { deleteUserService };
