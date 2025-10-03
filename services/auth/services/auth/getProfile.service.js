// services/auth/getProfile.service.js
const { prisma, logger } = require('../../utils');

async function getProfileService(userId) {
  try {
    logger.debug(`[AUTH][GET_PROFILE] Récupération du profil pour userId=${userId}`);

    const parsedId = Number(userId);
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      logger.warn(`[AUTH][GET_PROFILE] ID utilisateur invalide: ${userId}`);
      return { error: 'INVALID_USER_ID' };
    }

    // On sélectionne uniquement les champs utiles (jamais le hash du mot de passe)
    const user = await prisma.user.findUnique({
      where: { id: parsedId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        birthDate: true,
        role: true,
        invisibleKey: true, // si ton front en a besoin
        lastLogin: true,
        isBlacklisted: true,
        blacklistReason: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      logger.warn(`[AUTH][GET_PROFILE] Profil introuvable pour userId=${parsedId}`);
      return null; // contrôleur mappe vers USER_NOT_FOUND
    }

    logger.info(`[AUTH][GET_PROFILE] Profil trouvé pour userId=${parsedId}`);
    return user;
  } catch (err) {
    logger.error(`[AUTH][GET_PROFILE] Erreur service: ${err.message}`);
    return { error: 'INTERNAL_SERVER_ERROR' };
  }
}

module.exports = { getProfileService };
