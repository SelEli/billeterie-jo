const { prisma, logger } = require('../../utils');

const createUserService = async (data) => {
  logger.debug('[USER][CREATE] Creating new user', { email: data.email });

  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    logger.warn(`[USER][CREATE] Email already exists: ${data.email}`);
    return null;
  }

  const user = await prisma.user.create({ data });
  logger.info(`[USER][CREATE] User created [id=${user.id}]`);
  return user;
};

module.exports = { createUserService };
