// controllers/auth/loginUser.controller.js
const { success, error } = require('../../utils/response');
const { logger } = require('../../utils');
const { loginService } = require('../../services/auth');

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    logger.debug(`[AUTH][LOGIN] Attempting login for email=${email}`);

    if (!email || !password) {
      return res.status(400).json(error(['VALIDATION_FAILED']));
    }

    const result = await loginService({ email, password });

    if (!result) return res.status(404).json(error(['USER_NOT_FOUND']));
    if (result.error) {
      const map = {
        USER_NOT_FOUND: 404,
        BAD_PASSWORD: 401
      };
      return res.status(map[result.error] || 400).json(error([result.error]));
    }

    logger.info(`[AUTH][LOGIN] Login successful for email=${email}`);
    return res.status(200).json(success(result, { message: 'Login successful' }));

  } catch (err) {
    logger.error(`[AUTH][LOGIN] Unexpected error: ${err.message}`);
    return res.status(500).json(error(['Internal server error.']));
  }
};

module.exports = { loginController };