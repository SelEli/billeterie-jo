// services/auth/registerUser.service.js
const { prisma, logger, publishKafkaEvent, generateInvisibleKey } = require('../../utils');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const TOKEN_EXPIRATION = '1h';

async function registerUserService({ firstName, lastName, email, password, birthDate }) {
  try {
    logger.debug('[AUTH][REGISTER] Preparing to register new user');

    if (!email || !password) {
      logger.warn('[AUTH][REGISTER] Missing required fields: email or password');
      return { error: 'VALIDATION_FAILED' };
    }

    const emailClean = email.toLowerCase().trim();

    // Vérifier si l'email est déjà pris
    const existing = await prisma.user.findUnique({ where: { email: emailClean } });
    if (existing) {
      logger.warn(`[AUTH][REGISTER] Email already registered: ${emailClean}`);
      return null; // contrôleur renverra 409
    }

    // Hachage du mot de passe
    const hash = await bcrypt.hash(password, 10);

    // Génération de la clé invisible
    const invisibleKey = generateInvisibleKey();

    // Création de l’utilisateur
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email: emailClean,
        hash,
        birthDate: birthDate ? new Date(birthDate) : null,
        invisibleKey,
        role: 'VISITOR',
        lastLogin: null,
        isBlacklisted: false,
        blacklistReason: null
      }
    });

    // Création du token JWT
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

    // Événement Kafka (protégé)
    try {
      await publishKafkaEvent('user.created', {
        userId: user.id,
        role: user.role,
        invisibleKey: user.invisibleKey
      });
    } catch (err) {
      logger.warn(`[AUTH][REGISTER] Kafka publish skipped: ${err.message}`);
    }

    return { user, token };
  } catch (err) {
    logger.error(`[AUTH][REGISTER] Service error: ${err.message}`);
    throw err;
  }
}

module.exports = { registerUserService };
