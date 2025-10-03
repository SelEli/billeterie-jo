// services/user/readUser.service.js
const { prisma, logger } = require('../../utils');

const readUserService = async (id) => {
  try {
    const userId = Number(id);
    if (!Number.isInteger(userId) || userId <= 0) {
      logger.warn(`[USER][READ] ID utilisateur invalide: ${id}`);
      return { error: 'INVALID_USER_ID' };
    }

    logger.debug(`[USER][READ] Lecture utilisateur [id=${userId}]`);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        birthDate: true,
        role: true,
        invisibleKey: true,
        lastLogin: true,
        isBlacklisted: true,
        blacklistReason: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      logger.warn(`[USER][READ] Utilisateur introuvable [id=${userId}]`);
      return null;
    }

    logger.info(`[USER][READ] Utilisateur trouvé [id=${user.id}]`);
    return user;
  } catch (err) {
    logger.error('[USER][READ] Erreur service:', err);
    return { error: 'INTERNAL_SERVER_ERROR' };
  }
};

module.exports = { readUserService };
