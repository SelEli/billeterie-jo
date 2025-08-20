const { prisma, logger } = require('../../utils');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const TOKEN_EXPIRATION = '1h';

async function loginService({ email, password }) {
  const emailClean = email.toLowerCase().trim();
  const user = await prisma.user.findUnique({ where: { email: emailClean } });
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.hash);
  if (!isValid) return null;

  const token = jwt.sign({
    userId: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    invisibleKey: user.invisibleKey
  }, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });

  logger.info(`User logged in: ${user.email}`);
  return { token };
}

module.exports = { loginService };
