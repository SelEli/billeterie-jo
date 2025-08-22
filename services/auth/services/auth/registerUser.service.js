// services/auth/registerUser.service.js
const { prisma, logger, publishKafkaEvent, generateInvisibleKey } = require('../../utils');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const TOKEN_EXPIRATION = '1h';

async function registerUserService({ firstName, lastName, email, password, birthDate, role }) {
  try {
    logger.debug('[AUTH][REGISTER] Preparing to register new user');

    if (!email || !password || !firstName || !lastName || !birthDate) {
      logger.warn('[AUTH][REGISTER] Missing required fields');
      return { error: 'MISSING_REQUIRED_FIELDS' };
    }

    const emailClean = String(email).toLowerCase().trim();

    // Vérifier doublon
    const existing = await prisma.user.findUnique({ where: { email: emailClean } });
    if (existing) {
      logger.warn(`[AUTH][REGISTER] Email already registered: ${emailClean}`);
      return { error: 'EMAIL_ALREADY_USED' };
    }

    const hash = await bcrypt.hash(password, 10);
    const invisibleKey = generateInvisibleKey();

    let user;
    try {
      user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email: emailClean,
          hash,
          birthDate: new Date(birthDate),
          invisibleKey,
          role: role || 'VISITOR',
          lastLogin: null,
          isBlacklisted: false,
          blacklistReason: null
        }
      });
    } catch (err) {
      if (err.code === 'P2002') {
        logger.warn(`[AUTH][REGISTER] Unique constraint violation for email: ${emailClean}`);
        return { error: 'EMAIL_ALREADY_USED' };
      }
      throw err;
    }

    if (!process.env.JWT_SECRET) {
      logger.error('[AUTH][REGISTER] JWT_SECRET is not configured');
      return { error: 'SERVER_MISCONFIGURATION' };
    }

    const token = jwt.sign(
      {
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        invisibleKey: user.invisibleKey
      },
      process.env.JWT_SECRET,
      { expiresIn: TOKEN_EXPIRATION }
    );

    logger.info(`[AUTH][REGISTER] User registered: ${user.email} (id=${user.id})`);

    try {
      await publishKafkaEvent('user.created', {
        userId: user.id,
        role: user.role,
        invisibleKey: user.invisibleKey
      });
    } catch (err) {
      logger.warn(`[AUTH][REGISTER] Kafka publish skipped: ${err.message}`);
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      birthDate: user.birthDate,
      token
    };
  } catch (err) {
    logger.error(`[AUTH][REGISTER] Service error: ${err.message}`);
    throw err;
  }
}

module.exports = { registerUserService };
