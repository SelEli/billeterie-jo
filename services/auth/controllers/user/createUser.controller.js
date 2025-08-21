const { success, error } = require('../../utils/response');
const { logger } = require('../../utils');
const { createUserService } = require('../../services/user');

const createUserController = async (req, res) => {
  try {
    logger.debug('[USER][CREATE] Creating new user');

    const { email, password, firstName, lastName } = req.body;
    if (!email || !password || !firstName || !lastName) {
      logger.warn('[USER][CREATE] Missing required fields');
      return res.status(400).json(error(['MISSING_REQUIRED_FIELDS']));
    }

    const user = await createUserService(req.body);

    if (user?.error) {
      logger.warn(`[USER][CREATE] Business error: ${user.error}`);
      return res.status(400).json(error([user.error]));
    }

    if (!user) {
      logger.warn(`[USER][CREATE] Email already used: ${email}`);
      return res.status(409).json(error(['EMAIL_ALREADY_USED']));
    }

    logger.info(`[USER][CREATE] User created successfully: ${user.email}`);
    return res
      .status(201)
      .json(success(user, { message: 'User created successfully' }));

  } catch (err) {
    logger.error(`[USER][CREATE] Internal error: ${err.message}`);
    return res.status(500).json(error(['Internal server error.']));
  }
};

module.exports = { createUserController };
