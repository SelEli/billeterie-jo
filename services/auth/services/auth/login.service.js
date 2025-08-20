// services/auth/login.service.js
const { prisma, logger } = require('../../utils');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const TOKEN_EXPIRATION = '1h';

async function loginService({ email, password }) {
  try {
    logger.debug('[AUTH][LOGIN] Preparing to authenticate user');

    if (!email || !password) {
      logger.warn('[AUTH][LOGIN] Missing email or password');
      return { error: 'VALIDATION_FAILED' };
    }

    const emailClean = email.toLowerCase().trim();

    // Recherche de l'utilisateur
    const user = await prisma.user.findUnique({ where: { email: emailClean } });
    if (!user) {
      logger.warn(`[AUTH][LOGIN] User not found: ${emailClean}`);
      return { error: 'USER_NOT_FOUND' };
    }

    // Vérification du mot de passe
    const isValid = await bcrypt.compare(password, user.hash);
    if (!isValid) {
      logger.warn(`[AUTH][LOGIN] Bad password for ${emailClean}`);
      return { error: 'BAD_PASSWORD' };
    }

    // Génération du JWT
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
    return { token };
  } catch (err) {
    logger.error(`[AUTH][LOGIN] Service error: ${err.message}`);
    throw err; // on laisse le contrôleur gérer l'erreur 500
  }
}

module.exports = { loginService };
