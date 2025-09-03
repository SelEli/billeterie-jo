const { prisma, logger, publishKafkaEvent, generateInvisibleKey } = require('../../utils');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const TOKEN_EXPIRATION = '1h';

async function registerUserService({ firstName, lastName, email, password, birthDate, role }) {
  try {
    logger.debug('[AUTH][REGISTER] Preparing to register new user', {
      firstName,
      lastName,
      email,
      birthDate,
      role
    });

    if (!email || !password || !firstName || !lastName || !birthDate) {
      logger.warn('[AUTH][REGISTER] Missing required fields');
      return { error: 'MISSING_REQUIRED_FIELDS' };
    }

    const emailClean = String(email).toLowerCase().trim();

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
      if (err.code === 'P2002') return { error: 'EMAIL_ALREADY_USED' };
      return { error: 'INTERNAL_SERVER_ERROR' };
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) return { error: 'SERVER_MISCONFIGURATION' };

    let token;
    try {
      token = jwt.sign(
        {
          userId: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          invisibleKey: user.invisibleKey
        },
        secret,
        { expiresIn: TOKEN_EXPIRATION }
      );
    } catch {
      return { error: 'TOKEN_GENERATION_FAILED' };
    }

    logger.info(`[AUTH][REGISTER] User registered: ${user.email} (id=${user.id})`);

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
      logger.debug('[AUTH][REGISTER] Kafka event published');
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
    logger.error('[AUTH][REGISTER] Service error:', err);
    return { error: 'INTERNAL_SERVER_ERROR' };
  }
}

module.exports = { registerUserService };
