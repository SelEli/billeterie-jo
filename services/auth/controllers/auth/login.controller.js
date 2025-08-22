// controllers/auth/login.controller.js
const { logger } = require('../../utils');
const { loginService } = require('../../services/auth');
const { sendBusinessError } = require('../../utils/sendError');
const { sendBusinessSuccess } = require('../../utils/sendSuccess');

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    logger.debug(`[AUTH][LOGIN] Attempting login for email=${email}`);

    // Champs obligatoires
    if (!email || !password) {
      return sendBusinessError(res, 'MISSING_CREDENTIALS');
    }

    const result = await loginService({ email, password });

    // Cas métier négatif
    if (result?.error) {
      return sendBusinessError(res, result.error);
    }

    // Utilisateur inexistant
    if (!result) {
      return sendBusinessError(res, 'USER_NOT_FOUND');
    }

    // Succès
    return sendBusinessSuccess(res, 'CREATE_AUTH', result, { message: 'Login successful' });
  } catch (err) {
    logger.error(`[AUTH][LOGIN] Unexpected error: ${err.message}`);
    return sendBusinessError(res, 'INTERNAL_SERVER_ERROR');
  }
};

module.exports = { loginController };
