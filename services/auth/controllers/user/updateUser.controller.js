// controllers/user/updateUser.controller.js
const { logger } = require('../../utils');
const { updateUserService } = require('../../services/user');
const { sendBusinessError } = require('../../utils/sendError');
const { sendBusinessSuccess } = require('../../utils/sendSuccess');

const updateUserController = async (req, res) => {
  try {
    const parsedId = Number(req.params.id);

    if (req.user?.role !== 'ADMIN') {
      return sendBusinessError(res, 'FORBIDDEN', 403);
    }

    logger.debug(`[USER][UPDATE] Request to update user [id=${parsedId}]`);

    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      return sendBusinessError(res, 'INVALID_USER_ID', 400);
    }

    const result = await updateUserService(parsedId, req.body);

    if (result?.error) {
      const statusMap = {
        EMAIL_REQUIRED: 400,
        EMAIL_ALREADY_USED: 409,
        MISSING_REQUIRED_FIELDS: 400
      };
      return sendBusinessError(res, result.error, statusMap[result.error] || 400);
    }

    if (result === null) {
      return sendBusinessError(res, 'USER_NOT_FOUND', 404);
    }

    // Objet user à plat dans data
    return sendBusinessSuccess(
      res,
      'UPDATE_USER',
      result,
      { message: 'User updated successfully' },
      200
    );
  } catch (err) {
    logger.error(`[USER][UPDATE] Internal error: ${err.message}`);
    return sendBusinessError(res, 'INTERNAL_SERVER_ERROR', 500);
  }
};

module.exports = { updateUserController };
