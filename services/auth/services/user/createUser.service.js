const { prisma, logger } = require('../../utils');

const createUserService = async (data) => {
  try {
    logger.debug('[USER][CREATE] Creating new user', { email: data?.email });

    if (!data?.email || typeof data.email !== 'string') {
      logger.warn('[USER][CREATE] Missing or invalid email');
      return { error: 'EMAIL_REQUIRED' };
    }

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      logger.warn(`[USER][CREATE] Email already exists: ${data.email}`);
      return { error: 'EMAIL_ALREADY_USED' };
    }

    const user = await prisma.user.create({ data });
    logger.info(`[USER][CREATE] User created [id=${user.id}]`);
    return user;
  } catch (err) {
    logger.error(`[USER][CREATE] Service error: ${err.message}`);
    throw err;
  }
};

module.exports = { createUserService };
