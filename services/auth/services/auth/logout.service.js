// services/auth/logout.service.js
const { logger, publishKafkaEvent } = require('../../utils');

const logoutService = async (user) => {
  try {
    const userId = user?.id;
    logger.debug(`[AUTH][LOGOUT] Initiating logout process for userId=${userId}`);

    const parsedId = Number(userId);
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      logger.warn('[AUTH][LOGOUT] No valid user provided for logout');
      return { error: 'INVALID_USER_ID' };
    }

    logger.info(`[AUTH][LOGOUT] User ${parsedId} logged out successfully`);

    try {
      await publishKafkaEvent('user.logged_out', { userId: parsedId });
    } catch (err) {
      logger.warn(`[AUTH][LOGOUT] Kafka publish skipped: ${err.message}`);
    }

    return true;
  } catch (err) {
    logger.error(`[AUTH][LOGOUT] Service error: ${err.message}`);
    throw err;
  }
};

module.exports = { logoutService };
