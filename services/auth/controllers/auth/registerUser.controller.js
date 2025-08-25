// controllers/auth/registerUser.controller.js
const { logger } = require('../../utils');
const { registerUserService } = require('../../services/auth');
const { sendBusinessError } = require('../../utils/sendError');
const { sendBusinessSuccess } = require('../../utils/sendSuccess');

const registerUserController = async (req, res) => {
  try {
    const { email, password, firstName, lastName, birthDate, role } = req.body || {};
    logger.debug(`[AUTH][REGISTER] Attempting registration for email=${email}`, {
      body: req.body
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
      return sendBusinessError(res, 'MISSING_REQUIRED_FIELDS', 400);
    }

    const result = await registerUserService({
      email,
      password,
      firstName,
      lastName,
      birthDate,
      role
    });

    // Gestion des erreurs métier renvoyées par le service
    if (result?.error) {
      logger.warn(`[AUTH][REGISTER] Service returned error: ${result.error}`);
      switch (result.error) {
        case 'MISSING_REQUIRED_FIELDS':
          return sendBusinessError(res, 'MISSING_REQUIRED_FIELDS', 400);
        case 'EMAIL_ALREADY_USED':
          return sendBusinessError(res, 'EMAIL_ALREADY_USED', 409);
        case 'SERVER_MISCONFIGURATION':
          return sendBusinessError(res, 'SERVER_MISCONFIGURATION', 500);
        case 'TOKEN_GENERATION_FAILED':
          return sendBusinessError(res, 'TOKEN_GENERATION_FAILED', 500);
        default:
          return sendBusinessError(res, 'INTERNAL_SERVER_ERROR', 500);
      }
    }

    // Sécurité : si aucun résultat et pas d'erreur explicite
    if (!result) {
      logger.error('[AUTH][REGISTER] No result and no explicit error from service');
      return sendBusinessError(res, 'EMAIL_ALREADY_USED', 409);
    }

    // Succès → 201 Created
    logger.debug('[AUTH][REGISTER] Registration successful, sending 201');
    return sendBusinessSuccess(res, 'CREATE_AUTH', result, {
      message: 'User registered successfully'
    });
  } catch (err) {
    // Log complet pour debug
    logger.error('[AUTH][REGISTER] Unexpected error object:', err);
    logger.error('[AUTH][REGISTER] Unexpected error stack:', err && err.stack);
    return sendBusinessError(res, 'INTERNAL_SERVER_ERROR', 500);
  }
};

module.exports = { registerUserController };
