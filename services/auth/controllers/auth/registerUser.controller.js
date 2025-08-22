// controllers/auth/registerUser.controller.js
const { logger } = require('../../utils');
const { registerUserService } = require('../../services/auth');
const { sendBusinessError } = require('../../utils/sendError');
const { sendBusinessSuccess } = require('../../utils/sendSuccess');

const registerUserController = async (req, res) => {
  try {
    const { email, password, firstName, lastName, birthDate, role } = req.body || {};
    logger.debug(`[AUTH][REGISTER] Attempting registration for email=${email}`);

    // Champs obligatoires
    if (!email || !password || !firstName || !lastName || !birthDate) {
      return sendBusinessError(res, 'MISSING_REQUIRED_FIELDS');
    }

    const result = await registerUserService({ email, password, firstName, lastName, birthDate, role });

    // Cas métier négatif
    if (result?.error) {
      return sendBusinessError(res, result.error);
    }

    // Doublon (par sécurité, même si le service renvoie déjà EMAIL_ALREADY_USED)
    if (!result) {
      return sendBusinessError(res, 'EMAIL_ALREADY_USED');
    }

    // Succès → 201 Created
    return sendBusinessSuccess(res, 'CREATE_AUTH', result, { message: 'User registered successfully' });
  } catch (err) {
    logger.error(`[AUTH][REGISTER] Unexpected error: ${err.message}`);
    return sendBusinessError(res, 'INTERNAL_SERVER_ERROR');
  }
};

module.exports = { registerUserController };
