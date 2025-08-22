// controllers/user/updateUser.controller.js
const { logger } = require('../../utils');
const { updateUserService } = require('../../services/user');
const { sendBusinessError } = require('../../utils/sendError');
const { sendBusinessSuccess } = require('../../utils/sendSuccess');

const updateUserController = async (req, res) => {
  try {
    const parsedId = Number(req.params.id);

    if (req.user?.role !== 'ADMIN') {
      return sendBusinessError(res, 'FORBIDDEN');
    }

    logger.debug(`[USER][UPDATE] Request to update user [id=${parsedId}]`);

    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      return sendBusinessError(res, 'INVALID_USER_ID');
    }

    const result = await updateUserService(parsedId, req.body);

    if (result?.error) {
      return sendBusinessError(res, result.error);
    }

    if (result === null) {
      return sendBusinessError(res, 'USER_NOT_FOUND');
    }

    return sendBusinessSuccess(res, 'UPDATE_USER', result, { message: 'User updated successfully' });
  } catch (err) {
    logger.error(`[USER][UPDATE] Internal error: ${err.message}`);
    return sendBusinessError(res, 'INTERNAL_SERVER_ERROR');
  }
};

module.exports = { updateUserController };
