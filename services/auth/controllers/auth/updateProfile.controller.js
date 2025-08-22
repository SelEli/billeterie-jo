// controllers/auth/updateProfile.controller.js
const { logger } = require('../../utils');
const { updateProfileService } = require('../../services/auth');
const { sendBusinessError } = require('../../utils/sendError');
const { sendBusinessSuccess } = require('../../utils/sendSuccess');

const updateProfileController = async (req, res) => {
  try {
    const userId = Number(req.user?.userId);
    logger.debug(`[AUTH][PROFILE][UPDATE] Attempting profile update for userId=${userId}`);

    if (!Number.isInteger(userId) || userId <= 0) {
      return sendBusinessError(res, 'INVALID_USER_ID');
    }

    const result = await updateProfileService(userId, req.body);

    if (result?.error) {
      return sendBusinessError(res, result.error);
    }

    if (!result) {
      return sendBusinessError(res, 'USER_NOT_FOUND');
    }

    return sendBusinessSuccess(res, 'UPDATE_PROFILE', result, { message: 'Profile updated successfully' });
  } catch (err) {
    logger.error(`[AUTH][PROFILE][UPDATE] Unexpected error: ${err.message}`);
    return sendBusinessError(res, 'INTERNAL_SERVER_ERROR');
  }
};

module.exports = { updateProfileController };
