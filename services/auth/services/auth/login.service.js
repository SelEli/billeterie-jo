const { prisma, logger } = require('../../utils');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const TOKEN_EXPIRATION = '1h';

async function loginService({ email, password }) {
  try {
    logger.debug('[AUTH][LOGIN] Tentative de connexion utilisateur');

    if (!email || !password) {
      logger.warn('[AUTH][LOGIN] Email ou mot de passe manquant');
      return { error: 'MISSING_CREDENTIALS' };
    }

    const emailClean = String(email).toLowerCase().trim();

    const user = await prisma.user.findUnique({ where: { email: emailClean } });
    if (!user) {
      logger.warn(`[AUTH][LOGIN] Utilisateur introuvable: ${emailClean}`);
      return { error: 'USER_NOT_FOUND' };
    }

    const isValid = await bcrypt.compare(password, user.hash);
    if (!isValid) {
      logger.warn(`[AUTH][LOGIN] Mot de passe invalide pour ${emailClean}`);
      return { error: 'INVALID_PASSWORD' };
    }

    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 32) {
      logger.error('[AUTH][LOGIN] JWT_SECRET manquant ou trop faible');
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
      logger.error('[AUTH][LOGIN] Erreur génération JWT:', err);
      return { error: 'TOKEN_GENERATION_FAILED' };
    }

    logger.info(`[AUTH][LOGIN] Connexion réussie: ${user.email}`);

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
    logger.error('[AUTH][LOGIN] Erreur service:', err);
    return { error: 'INTERNAL_SERVER_ERROR' };
  }
}

module.exports = { loginService };
