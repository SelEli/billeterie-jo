// services/user/createUser.service.js
const { prisma, logger, publishKafkaEvent } = require('../../utils');
const bcrypt = require('bcrypt');

const createUserService = async (data) => {
  try {
    logger.debug('[USER][CREATE] Creating new user', { email: data?.email });

    if (!data?.email || typeof data.email !== 'string' || !data.email.includes('@')) {
      return { error: 'EMAIL_REQUIRED' };
    }
    if (!data?.password || typeof data.password !== 'string') {
      return { error: 'PASSWORD_REQUIRED' };
    }

    data.email = data.email.trim().toLowerCase();

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) return { error: 'EMAIL_ALREADY_USED' };

    const hash = await bcrypt.hash(data.password, 10);

    let user;
    try {
      user = await prisma.user.create({
        data: {
          email: data.email,
          hash,
          firstName: data.firstName?.trim() || null,
          lastName: data.lastName?.trim() || null,
          birthDate: data.birthDate ? new Date(data.birthDate) : null,
          role: data.role || 'VISITOR',
          invisibleKey: `key-${Date.now()}`
        },
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
      if (err.code === 'P2002') return { error: 'EMAIL_ALREADY_USED' };
      throw err;
    }

    logger.info(`[USER][CREATE] User created [id=${user.id}]`);

    try {
      await publishKafkaEvent('user', {
        type: 'UserCreated',
        userId: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        invisibleKey: user.invisibleKey
      });
      logger.debug('[USER][CREATE] Kafka event published');
    } catch (err) {
      logger.warn(`[USER][CREATE] Kafka publish skipped: ${err.message}`);
    }

    return user;
  } catch (err) {
    logger.error(`[USER][CREATE] Service error: ${err.message}`);
    throw err;
  }
};

module.exports = { createUserService };
