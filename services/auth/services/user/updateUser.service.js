// services/user/updateUser.service.js
const { prisma, logger, publishKafkaEvent } = require('../../utils');

const updateUserService = async (id, data) => {
  try {
    const userId = Number(id);
    if (!Number.isInteger(userId) || userId <= 0) {
      logger.warn(`[USER][UPDATE] ID utilisateur invalide: ${id}`);
      return { error: 'INVALID_USER_ID' };
    }

    if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
      logger.warn(`[USER][UPDATE] Aucun champ fourni pour la mise à jour [id=${userId}]`);
      return { error: 'MISSING_REQUIRED_FIELDS' };
    }

    // Filtrage des champs autorisés
    const allowedFields = ['firstName', 'lastName', 'birthDate', 'email'];
    const safeData = {};
    for (const key of allowedFields) {
      if (data[key] !== undefined) {
        if (key === 'email') {
          if (typeof data.email !== 'string' || !data.email.includes('@')) {
            logger.warn(`[USER][UPDATE] Format email invalide [id=${userId}]`);
            return { error: 'EMAIL_REQUIRED' };
          }
          safeData.email = data.email.trim().toLowerCase();
        } else if (key === 'birthDate') {
          safeData.birthDate = new Date(data.birthDate);
        } else {
          safeData[key] = String(data[key]).trim();
        }
      }
    }

    logger.debug(`[USER][UPDATE] Mise à jour utilisateur [id=${userId}]`);

    const existing = await prisma.user.findUnique({ where: { id: userId } });
    if (!existing) {
      logger.warn(`[USER][UPDATE] Utilisateur introuvable [id=${userId}]`);
      return null;
    }

    let updated;
    try {
      updated = await prisma.user.update({
        where: { id: userId },
        data: safeData,
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
    } catch (err) {
      if (err.code === 'P2002') {
        logger.warn(`[USER][UPDATE] Contrainte unique violée pour email: ${data?.email}`);
        return { error: 'EMAIL_ALREADY_USED' };
      }
      logger.error('[USER][UPDATE] Erreur Prisma:', err);
      return { error: 'INTERNAL_SERVER_ERROR' };
    }

    logger.info(`[USER][UPDATE] Utilisateur mis à jour [id=${updated.id}]`);

    try {
      await publishKafkaEvent('user', {
        type: 'UserUpdated',
        userId: updated.id,
        email: updated.email,
        firstName: updated.firstName,
        lastName: updated.lastName,
        role: updated.role,
        invisibleKey: updated.invisibleKey
      });
      logger.debug('[USER][UPDATE] Événement Kafka publié');
    } catch (err) {
      logger.warn(`[USER][UPDATE] Kafka non publié: ${err.message}`);
    }

    return updated;
  } catch (err) {
    logger.error('[USER][UPDATE] Erreur service:', err);
    return { error: 'INTERNAL_SERVER_ERROR' };
  }
};

module.exports = { updateUserService };
