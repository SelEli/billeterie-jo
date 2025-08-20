// services/auth/deleteProfile.service.js
const { prisma, logger, publishKafkaEvent } = require('../../utils');

async function deleteProfileService(userId) {
  try {
    logger.debug(`[AUTH][DELETE_PROFILE] Request to self-delete user [id=${userId}]`);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      logger.warn(`[AUTH][DELETE_PROFILE] User not found [id=${userId}]`);
      return null;
    }

    await prisma.user.delete({ where: { id: userId } });
    logger.info(`[AUTH][DELETE_PROFILE] User self-deleted [id=${userId}]`);

    // Kafka non bloquant
    try {
      await publishKafkaEvent('user.deleted', { userId });
    } catch (err) {
      logger.warn(`[AUTH][DELETE_PROFILE] Kafka publish skipped: ${err.message}`);
    }

    return true;
  } catch (err) {
    logger.error(`[AUTH][DELETE_PROFILE] Service error: ${err.message}`);
    throw err;
  }
}

module.exports = { deleteProfileService };
