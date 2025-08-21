// controllers/auth/registerUser.controller.js
const { success, error } = require('../../utils/response');
const { logger } = require('../../utils');
const { registerUserService } = require('../../services/auth');

const registerUserController = async (req, res) => {
  try {
    const { email, password, firstName, lastName, birthDate, role } = req.body;
    logger.debug(`[AUTH][REGISTER] Attempting registration for email=${email}`);

    // Validation minimale
    if (!email || !password || !firstName || !lastName || !birthDate) {
      return res.status(400).json(error(['VALIDATION_FAILED']));
    }

    const result = await registerUserService({
      email,
      password,
      firstName,
      lastName,
      birthDate,
      role
    });

    if (!result) return res.status(409).json(error(['DUPLICATE_EMAIL']));
    if (result.error) {
      const map = {
        VALIDATION_FAILED: 400,
        ROLE_NOT_ALLOWED: 403,
        DUPLICATE_EMAIL: 409
      };
      return res.status(map[result.error] || 400).json(error([result.error]));
    }

    logger.info(`[AUTH][REGISTER] User registered successfully [id=${result.id}]`);
    return res
      .status(201)
      .json(success(result, { message: 'User registered successfully' }));

  } catch (err) {
    logger.error(`[AUTH][REGISTER] Unexpected error: ${err.message}`);
    return res.status(500).json(error(['Internal server error.']));
  }
};

module.exports = { registerUserController };