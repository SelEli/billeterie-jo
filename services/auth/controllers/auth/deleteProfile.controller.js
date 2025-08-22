// controllers/auth/deleteProfile.controller.js
const { logger } = require('../../utils');
const { deleteProfileService } = require('../../services/auth');
const { sendBusinessError } = require('../../utils/sendError');
const { sendBusinessSuccess } = require('../../utils/sendSuccess');

const deleteProfileController = async (req, res) => {
  try {
    const userId = Number(req.user?.userId);
    logger.debug(`[AUTH][DELETE_PROFILE] Self-delete request for userId=${userId}`);

    if (!Number.isInteger(userId) || userId <= 0) {
      return sendBusinessError(res, 'INVALID_USER_ID');
    }

    const deleted = await deleteProfileService(userId);

    if (deleted?.error) {
      return sendBusinessError(res, deleted.error);
    }

    if (!deleted) {
      return sendBusinessError(res, 'USER_NOT_FOUND');
    }

    return sendBusinessSuccess(res, 'DELETE');
  } catch (err) {
    logger.error(`[AUTH][DELETE_PROFILE] Unexpected error: ${err.message}`);
    return sendBusinessError(res, 'INTERNAL_SERVER_ERROR');
  }
};

module.exports = { deleteProfileController };
