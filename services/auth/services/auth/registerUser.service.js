const { prisma, logger, publishKafkaEvent, generateInvisibleKey } = require('../../utils');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const TOKEN_EXPIRATION = '1h';

async function registerUserService({ firstName, lastName, email, password, birthDate }) {
  const emailClean = email.toLowerCase().trim();

  const existing = await prisma.user.findUnique({ where: { email: emailClean } });
  if (existing) return null;

  const hash = await bcrypt.hash(password, 10);
  const key = generateInvisibleKey();

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email: emailClean,
      hash,
      birthDate: new Date(birthDate),
      invisibleKey: key,
      role: 'visitor',
      lastLogin: null,
      isBlacklisted: false,
      blacklistReason: null
    }
  });

  const token = jwt.sign({
    userId: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    invisibleKey: user.invisibleKey
  }, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });

  logger.info(`User registered: ${user.email}`);
  await publishKafkaEvent('user.created', {
    userId: user.id,
    role: user.role,
    invisibleKey: user.invisibleKey
  });

  return { user, token };
}

module.exports = { registerUserService };
