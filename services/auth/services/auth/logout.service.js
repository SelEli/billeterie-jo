// services/auth/logout.service.js
const { logger, publishKafkaEvent /*, prisma */ } = require('../../utils');

const logoutService = async (user) => {
  try {
    const userId = user?.id;
    logger.debug(`[AUTH][LOGOUT] Initiating logout process for userId=${userId}`);

    // Validation
    const parsedId = Number(userId);
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      logger.warn('[AUTH][LOGOUT] No valid user provided for logout');
      return { error: 'INVALID_USER' };
    }

    // Si utilisation d'un store/blacklist côté serveur :
    // await prisma.refreshToken.deleteMany({ where: { userId: parsedId } });
    // await redisClient.del(`session:${parsedId}`);

    logger.info(`[AUTH][LOGOUT] User ${parsedId} logged out successfully`);

    // Événement Kafka non bloquant
    try {
      await publishKafkaEvent('user.logged_out', { userId: parsedId });
    } catch (err) {
      logger.warn(`[AUTH][LOGOUT] Kafka publish skipped: ${err.message}`);
    }

    return true;
  } catch (err) {
    logger.error(`[AUTH][LOGOUT] Service error: ${err.message}`);
    throw err; // vrai incident technique → contrôleur renverra un 500
  }
};

module.exports = { logoutService };
