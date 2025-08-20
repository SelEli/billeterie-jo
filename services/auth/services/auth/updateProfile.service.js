// services/auth/updateProfile.service.js
const { prisma, logger } = require('../../utils');

async function updateProfileService(userId, payload) {
  try {
    logger.debug(`[AUTH][UPDATE_PROFILE] Updating profile for userId=${userId}`);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      logger.warn(`[AUTH][UPDATE_PROFILE] User not found [id=${userId}]`);
      return null;
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: payload
    });

    logger.info(`[AUTH][UPDATE_PROFILE] Profile updated for userId=${userId}`);
    return updated;
  } catch (err) {
    logger.error(`[AUTH][UPDATE_PROFILE] Service error: ${err.message}`);
    throw err;
  }
}

module.exports = { updateProfileService };
