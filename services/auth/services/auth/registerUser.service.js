const { prisma, logger, publishKafkaEvent, generateInvisibleKey } = require('../../utils');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const TOKEN_EXPIRATION = '1h';

async function registerUserService({ firstName, lastName, email, password, birthDate }) {
  try {
    logger.debug('[AUTH][REGISTER] Tentative d’enregistrement utilisateur', {
      firstName,
      lastName,
      email,
      birthDate
    });

    if (!email || !password || !firstName || !lastName || !birthDate) {
      logger.warn('[AUTH][REGISTER] Champs requis manquants');
      return { error: 'MISSING_REQUIRED_FIELDS' };
    }

    const emailClean = String(email).toLowerCase().trim();

    const existing = await prisma.user.findUnique({ where: { email: emailClean } });
    if (existing) {
      logger.warn(`[AUTH][REGISTER] Email déjà utilisé: ${emailClean}`);
      return { error: 'EMAIL_ALREADY_USED' };
    }

    const hash = await bcrypt.hash(password, 10);
    const invisibleKey = generateInvisibleKey();

    let user;
    try {
      user = await prisma.user.create({
        data: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: emailClean,
          hash,
          birthDate: new Date(birthDate),
          invisibleKey,
          role: 'VISITOR',
          lastLogin: null,
          isBlacklisted: false,
          blacklistReason: null
        }
      });
    } catch (err) {
      if (err.code === 'P2002') return { error: 'EMAIL_ALREADY_USED' };
      logger.error('[AUTH][REGISTER] Erreur Prisma:', err);
      return { error: 'INTERNAL_SERVER_ERROR' };
    }

    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 32) {
      logger.error('[AUTH][REGISTER] JWT_SECRET manquant ou trop faible');
      return { error: 'SERVER_MISCONFIGURATION' };
    }

    let token;
    try {
      token = jwt.sign(
        {
          userId: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        },
        secret,
        { expiresIn: TOKEN_EXPIRATION }
      );
    } catch (err) {
      logger.error('[AUTH][REGISTER] Erreur génération JWT:', err);
      return { error: 'TOKEN_GENERATION_FAILED' };
    }

    logger.info(`[AUTH][REGISTER] Utilisateur enregistré: ${user.email} (id=${user.id})`);

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
      logger.debug('[AUTH][REGISTER] Événement Kafka publié');
    } catch (err) {
      logger.warn(`[AUTH][REGISTER] Kafka non publié: ${err.message}`);
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      birthDate: user.birthDate,
      invisibleKey: user.invisibleKey,
      token
    };
  } catch (err) {
    logger.error('[AUTH][REGISTER] Erreur service:', err);
    return { error: 'INTERNAL_SERVER_ERROR' };
  }
}

module.exports = { registerUserService };
