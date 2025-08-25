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

    // Champs obligatoires
    if (!email || !password || !firstName || !lastName || !birthDate) {
      logger.warn('[AUTH][REGISTER] Missing required fields', {
        email: !!email,
        password: !!password,
        firstName: !!firstName,
        lastName: !!lastName,
        birthDate: !!birthDate
      });
      return { error: 'MISSING_REQUIRED_FIELDS' };
    }

    const emailClean = String(email).toLowerCase().trim();
    logger.debug(`[AUTH][REGISTER] Cleaned email: ${emailClean}`);

    // Vérifier doublon
    const existing = await prisma.user.findUnique({ where: { email: emailClean } });
    logger.debug(`[AUTH][REGISTER] Existing user lookup result: ${existing ? 'FOUND' : 'NOT_FOUND'}`);
    if (existing) {
      logger.warn(`[AUTH][REGISTER] Email already registered: ${emailClean}`);
      return { error: 'EMAIL_ALREADY_USED' };
    }

    logger.debug('[AUTH][REGISTER] Hashing password...');
    const hash = await bcrypt.hash(password, 10);
    logger.debug('[AUTH][REGISTER] Password hashed successfully');

    logger.debug('[AUTH][REGISTER] Generating invisible key...');
    const invisibleKey = generateInvisibleKey();
    logger.debug(`[AUTH][REGISTER] Invisible key generated: ${invisibleKey}`);

    let user;
    try {
      logger.debug('[AUTH][REGISTER] Creating user in DB...');
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
      logger.debug(`[AUTH][REGISTER] User created with id=${user.id}`);
    } catch (err) {
      logger.error('[AUTH][REGISTER] Prisma error during user.create:', err, err.stack);
      if (err.code === 'P2002') {
        logger.warn(`[AUTH][REGISTER] Unique constraint violation for email: ${emailClean}`);
        return { error: 'EMAIL_ALREADY_USED' };
      }
      return { error: 'INTERNAL_SERVER_ERROR' };
    }

    const secret = process.env.JWT_SECRET;
    logger.debug(`[AUTH][REGISTER] JWT_SECRET present: ${!!secret}`);
    if (!secret) {
      logger.error('[AUTH][REGISTER] JWT_SECRET is not configured');
      return { error: 'SERVER_MISCONFIGURATION' };
    }

    let token;
    try {
      logger.debug('[AUTH][REGISTER] Signing JWT...');
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
      logger.debug('[AUTH][REGISTER] JWT signed successfully');
    } catch (err) {
      logger.error('[AUTH][REGISTER] JWT signing failed:', err, err.stack);
      return { error: 'TOKEN_GENERATION_FAILED' };
    }

    logger.info(`[AUTH][REGISTER] User registered: ${user.email} (id=${user.id})`);

    try {
      logger.debug('[AUTH][REGISTER] Publishing Kafka event user.created...');
      await publishKafkaEvent('user.created', {
        userId: user.id,
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
    logger.error('[AUTH][REGISTER] Service error (outer catch):', err, err.stack);
    return { error: 'INTERNAL_SERVER_ERROR' };
  }
}

module.exports = { registerUserService };
