// services/auth/login.service.js
const { prisma, logger } = require('../../utils');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const TOKEN_EXPIRATION = '1h';

/**
 * Authentifie un utilisateur et renvoie un objet plat avec token + infos utiles
 */
async function loginService({ email, password }) {
  try {
    logger.debug('[AUTH][LOGIN] Preparing to authenticate user');

    // Validation entrée
    if (!email || !password) {
      logger.warn('[AUTH][LOGIN] Missing email or password');
      return { error: 'VALIDATION_FAILED' };
    }

    const emailClean = String(email).toLowerCase().trim();

    // Recherche utilisateur
    const user = await prisma.user.findUnique({ where: { email: emailClean } });
    if (!user) {
      logger.warn(`[AUTH][LOGIN] User not found: ${emailClean}`);
      return { error: 'USER_NOT_FOUND' };
    }

    // Vérification mot de passe
    const isValid = await bcrypt.compare(password, user.hash);
    if (!isValid) {
      logger.warn(`[AUTH][LOGIN] Bad password for ${emailClean}`);
      return { error: 'BAD_PASSWORD' };
    }

    if (!process.env.JWT_SECRET) {
      logger.error('[AUTH][LOGIN] JWT_SECRET is not configured');
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

    logger.info(`[AUTH][LOGIN] User logged in: ${user.email}`);

    // Objet plat prêt pour le contrôleur
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
    logger.error(`[AUTH][LOGIN] Service error: ${err.message}`);
    throw err;
  }
}

module.exports = { loginService };
