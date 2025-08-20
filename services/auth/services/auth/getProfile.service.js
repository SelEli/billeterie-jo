// services/auth/getProfile.service.js
const { prisma, logger } = require('../../utils');

async function getProfileService(userId) {
  try {
    logger.debug(`[AUTH][GET_PROFILE] Fetching profile for userId=${userId}`);
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      logger.warn(`[AUTH][GET_PROFILE] Profile not found for userId=${userId}`);
      return null;
    }

    logger.info(`[AUTH][GET_PROFILE] Profile found for userId=${userId}`);
    return user;
  } catch (err) {
    logger.error(`[AUTH][GET_PROFILE] Service error: ${err.message}`);
    throw err;
  }
}

module.exports = { getProfileService };
