// services/auth/updateProfile.service.js
const { prisma, logger } = require('../../utils');

async function updateProfileService(userId, payload) {
  try {
    logger.debug(`[AUTH][UPDATE_PROFILE] Updating profile for userId=${userId}`);

    // Validation de l'ID
    const parsedId = Number(userId);
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      logger.warn(`[AUTH][UPDATE_PROFILE] Invalid user ID: ${userId}`);
      return { error: 'INVALID_ID' };
    }

    const user = await prisma.user.findUnique({ where: { id: parsedId } });
    if (!user) {
      logger.warn(`[AUTH][UPDATE_PROFILE] User not found [id=${parsedId}]`);
      return null; // cas métier: profil inexistant
    }

    const updated = await prisma.user.update({
      where: { id: parsedId },
      data: payload
    });

    logger.info(`[AUTH][UPDATE_PROFILE] Profile updated for userId=${parsedId}`);
    return updated;
  } catch (err) {
    logger.error(`[AUTH][UPDATE_PROFILE] Service error: ${err.message}`);
    throw err; // incident technique → contrôleur renverra 500
  }
}

module.exports = { updateProfileService };
