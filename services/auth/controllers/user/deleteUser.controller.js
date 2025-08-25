// controllers/user/deleteUser.controller.js
const { logger } = require('../../utils');
const { deleteUserService } = require('../../services/user');
const { sendBusinessError } = require('../../utils/sendError');
const { sendBusinessSuccess } = require('../../utils/sendSuccess');

const deleteUserController = async (req, res) => {
  try {
    const parsedId = Number(req.params.id);
    logger.debug(`[USER][DELETE] Request to delete user [id=${parsedId}]`);

    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      return sendBusinessError(res, 'INVALID_USER_ID', 400);
    }

    const deleted = await deleteUserService(parsedId);

    if (deleted?.error) {
      return sendBusinessError(res, deleted.error, 400);
    }

    if (!deleted) {
      return sendBusinessError(res, 'USER_NOT_FOUND', 404);
    }

    return sendBusinessSuccess(res, 'DELETE_USER', null, null, 204);
  } catch (err) {
    logger.error(`[USER][DELETE] Internal error: ${err.message}`);
    return sendBusinessError(res, 'INTERNAL_SERVER_ERROR', 500);
  }
};

module.exports = { deleteUserController };
