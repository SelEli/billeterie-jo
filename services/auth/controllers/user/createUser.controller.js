// controllers/user/createUser.controller.js
const { logger } = require('../../utils');
const { createUserService } = require('../../services/user');
const { sendBusinessError } = require('../../utils/sendError');
const { sendBusinessSuccess } = require('../../utils/sendSuccess');

const createUserController = async (req, res) => {
  try {
    logger.debug('[USER][CREATE] Creating new user');

    // Vérif rôle admin en premier
    if (req.user?.role !== 'ADMIN') {
      return sendBusinessError(res, 'FORBIDDEN', 403);
    }

    const user = await createUserService(req.body);

    if (user?.error) {
      // On mappe directement les codes d'erreur métier aux statuts HTTP
      if (user.error === 'EMAIL_REQUIRED') {
        return sendBusinessError(res, 'EMAIL_REQUIRED', 400);
      }
      if (user.error === 'PASSWORD_REQUIRED') {
        return sendBusinessError(res, 'PASSWORD_REQUIRED', 400);
      }
      if (user.error === 'EMAIL_ALREADY_USED') {
        return sendBusinessError(res, 'EMAIL_ALREADY_USED', 409);
      }
      // fallback
      return sendBusinessError(res, user.error, 400);
    }

    if (!user) {
      return sendBusinessError(res, 'EMAIL_ALREADY_USED', 409);
    }

    return sendBusinessSuccess(
      res,
      'CREATE_USER',
      user,
      { message: 'User created successfully' },
      201
    );
  } catch (err) {
    logger.error(`[USER][CREATE] Internal error: ${err.message}`);
    return sendBusinessError(res, 'INTERNAL_SERVER_ERROR', 500);
  }
};

module.exports = { createUserController };
