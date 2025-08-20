// services/auth/logout.service.js
/**
 * Déconnexion de l'utilisateur.
 * - Invalide le token côté serveur si tu utilises un store/blacklist
 * - Ou simplement trace l'action dans les logs
 */
const { logger } = require('../../utils');

const logoutService = async (user) => {
  // Implémentation selon ta stratégie d'authentification
  logger.info(`[AUTH][LOGOUT] User ${user?.id || 'unknown'} logged out`);
  // Exemple : await prisma.refreshToken.deleteMany({ where: { userId: user.id } });
  return true;
};

module.exports = { logoutService };
