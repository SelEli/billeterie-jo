// controllers/auth/loginUser.controller.js
const { success, error } = require('../../utils/response');
const { logger } = require('../../utils');
const { loginService } = require('../../services/auth');

const loginController = async (req, res) => {
  try {
    logger.debug('[AUTH][LOGIN] Attempting login');

    const result = await loginService(req.body);

    // Aucun résultat → identifiants invalides
    if (!result) {
      logger.warn(`[AUTH][LOGIN] Invalid credentials for email=${req.body?.email}`);
      return res.status(401).json(error(['Invalid credentials.']));
    }

    // Erreur métier explicite
    if (result?.error) {
      logger.warn(`[AUTH][LOGIN] ${result.error} for email=${req.body?.email}`);
      switch (result.error) {
        case 'USER_NOT_FOUND':
          return res.status(404).json(error(['User not found.']));
        case 'BAD_PASSWORD':
          return res.status(401).json(error(['Invalid credentials.']));
        default:
          return res.status(400).json(error(['Login failed.']));
      }
    }

    logger.info(`[AUTH][LOGIN] Login successful for ${req.body?.email}`);
    return res.status(200).json(success(result));

  } catch (err) {
    const msg = err.message || '';
    logger.error(`[AUTH][LOGIN] Unexpected error: ${msg}`);
    return res.status(500).json(error(['Internal server error.']));
  }
};

module.exports = { loginController };
