// controllers/user/createUser.controller.js
const { logger } = require('../../utils');
const { createUserService } = require('../../services/user');
const { sendBusinessError } = require('../../utils/sendError');
const { sendBusinessSuccess } = require('../../utils/sendSuccess');

const createUserController = async (req, res) => {
  try {
    logger.debug('[USER][CREATE] Creating new user');

    const { email, password, firstName, lastName, birthDate } = req.body;
    if (!email || !password || !firstName || !lastName || !birthDate) {
      return sendBusinessError(res, 'MISSING_REQUIRED_FIELDS');
    }

    const user = await createUserService(req.body);

    if (user?.error) {
      return sendBusinessError(res, user.error);
    }

    if (!user) {
      return sendBusinessError(res, 'EMAIL_ALREADY_USED');
    }

    return sendBusinessSuccess(res, 'CREATE_USER', user, { message: 'User created successfully' });
  } catch (err) {
    logger.error(`[USER][CREATE] Internal error: ${err.message}`);
    return sendBusinessError(res, 'INTERNAL_SERVER_ERROR');
  }
};

module.exports = { createUserController };
