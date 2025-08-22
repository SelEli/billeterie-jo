// controllers/auth/getProfile.controller.js
const { logger } = require('../../utils');
const { getProfileService } = require('../../services/auth');
const { sendBusinessError } = require('../../utils/sendError');
const { sendBusinessSuccess } = require('../../utils/sendSuccess');

const getProfileController = async (req, res) => {
  try {
    const userId = Number(req.user?.userId);
    logger.debug(`[AUTH][PROFILE] Fetching profile for userId=${userId}`);

    // ID invalide
    if (!Number.isInteger(userId) || userId <= 0) {
      return sendBusinessError(res, 'INVALID_USER_ID');
    }

    const result = await getProfileService(userId);

    // Cas métier négatif
    if (result?.error) {
      return sendBusinessError(res, result.error);
    }

    // Utilisateur inexistant
    if (!result) {
      return sendBusinessError(res, 'USER_NOT_FOUND');
    }

    // Succès
    return sendBusinessSuccess(res, 'READ_ONE', result, { message: 'Profile retrieved successfully' });
  } catch (err) {
    logger.error(`[AUTH][PROFILE] Unexpected error: ${err.message}`);
    return sendBusinessError(res, 'INTERNAL_SERVER_ERROR');
  }
};

module.exports = { getProfileController };
