// services/user/updateUser.service.js
const { prisma, logger, publishKafkaEvent } = require('../../utils');

const updateUserService = async (id, data) => {
  try {
    const userId = Number(id);
    if (!Number.isInteger(userId) || userId <= 0) {
      logger.warn(`[USER][UPDATE] Invalid user ID: ${id}`);
      return { error: 'INVALID_USER_ID' };
    }

    if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
      logger.warn(`[USER][UPDATE] No data provided for update [id=${userId}]`);
      return { error: 'MISSING_REQUIRED_FIELDS' };
    }

    if (data.email) {
      if (typeof data.email !== 'string' || !data.email.includes('@')) {
        logger.warn(`[USER][UPDATE] Invalid email format for update [id=${userId}]`);
        return { error: 'EMAIL_REQUIRED' };
      }
      data.email = data.email.trim().toLowerCase();
    }

    if (data.birthDate) {
      data.birthDate = new Date(data.birthDate);
    }

    logger.debug(`[USER][UPDATE] Updating user [id=${userId}]`);

    const existing = await prisma.user.findUnique({ where: { id: userId } });
    if (!existing) {
      logger.warn(`[USER][UPDATE] User not found [id=${userId}]`);
      return null;
    }

    let updated;
    try {
      updated = await prisma.user.update({
        where: { id: userId },
        data,
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
        logger.warn(`[USER][UPDATE] Unique constraint violation for email: ${data?.email}`);
        return { error: 'EMAIL_ALREADY_USED' };
      }
      throw err;
    }

    logger.info(`[USER][UPDATE] User updated [id=${updated.id}]`);

    // Kafka non bloquant
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
      logger.debug('[USER][UPDATE] Kafka event published');
    } catch (err) {
      logger.warn(`[USER][UPDATE] Kafka publish skipped: ${err.message}`);
    }

    return updated;
  } catch (err) {
    logger.error(`[USER][UPDATE] Service error: ${err.message}`);
    throw err;
  }
};

module.exports = { updateUserService };
