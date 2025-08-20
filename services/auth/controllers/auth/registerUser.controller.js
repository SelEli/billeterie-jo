// controllers/auth/registerUser.controller.js
const { success, error } = require('../../utils/response');
const { logger } = require('../../utils');
const { registerUserService } = require('../../services/auth');

const registerUserController = async (req, res) => {
  try {
    logger.debug('[AUTH][REGISTER] Attempting user registration');

    const result = await registerUserService(req.body);

    // Aucun résultat → email déjà pris
    if (!result) {
      logger.warn(`[AUTH][REGISTER] Email already registered: ${req.body?.email}`);
      return res.status(409).json(error(['Email already registered.']));
    }

    // Gestion d'erreurs métier
    if (result?.error) {
      logger.warn(`[AUTH][REGISTER] Business error for email=${req.body?.email}: ${result.error}`);
      switch (result.error) {
        case 'VALIDATION_FAILED':
          return res.status(400).json(error(['Invalid input data.']));
        case 'ROLE_NOT_ALLOWED':
          return res.status(403).json(error(['Role not allowed.']));
        case 'DUPLICATE_EMAIL':
          return res.status(409).json(error(['Email already registered.']));
        default:
          return res.status(400).json(error(['Registration failed.']));
      }
    }

    logger.info(`[AUTH][REGISTER] User registered successfully [id=${result.id}]`);
    return res.status(201).json(success(result));

  } catch (err) {
    const msg = err.message || '';
    // Erreurs connues
    if (msg.includes('Unique constraint') || msg.toLowerCase().includes('duplicate')) {
      logger.warn(`[AUTH][REGISTER] Duplicate email error: ${req.body?.email}`);
      return res.status(409).json(error(['Email already registered.']));
    }
    if (msg.toLowerCase().includes('validation') || msg.includes('Invalid')) {
      logger.warn(`[AUTH][REGISTER] Validation failed for: ${req.body?.email}`);
      return res.status(400).json(error(['Invalid input data.']));
    }

    logger.error(`[AUTH][REGISTER] Unexpected error: ${msg}`);
    return res.status(500).json(error(['Internal server error.']));
  }
};

module.exports = { registerUserController };
