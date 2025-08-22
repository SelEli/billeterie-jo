// services/auth/getProfile.service.js
const { prisma, logger } = require('../../utils');

async function getProfileService(userId) {
  try {
    logger.debug(`[AUTH][GET_PROFILE] Fetching profile for userId=${userId}`);

    const parsedId = Number(userId);
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      logger.warn(`[AUTH][GET_PROFILE] Invalid user ID: ${userId}`);
      return { error: 'INVALID_USER_ID' };
    }

    const user = await prisma.user.findUnique({ where: { id: parsedId } });

    if (!user) {
      logger.warn(`[AUTH][GET_PROFILE] Profile not found for userId=${parsedId}`);
      return null; // contrôleur mappe vers USER_NOT_FOUND
    }

    logger.info(`[AUTH][GET_PROFILE] Profile found for userId=${parsedId}`);
    return user;
  } catch (err) {
    logger.error(`[AUTH][GET_PROFILE] Service error: ${err.message}`);
    throw err;
  }
}

module.exports = { getProfileService };
