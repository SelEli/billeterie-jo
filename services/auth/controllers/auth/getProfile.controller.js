// controllers/auth/getProfile.controller.js
const { success, error } = require('../../utils/response');
const { logger } = require('../../utils');
const { getProfileService } = require('../../services/auth');

const getProfileController = async (req, res) => {
  try {
    const userId = req.user?.userId;
    logger.debug(`[AUTH][PROFILE] Fetching profile for userId=${userId}`);

    if (!userId) {
      logger.warn('[AUTH][PROFILE] Missing userId in request');
      return res.status(400).json(error(['Invalid user ID.']));
    }

    const user = await getProfileService(userId);

    if (!user) {
      logger.warn(`[AUTH][PROFILE] Profile not found for userId=${userId}`);
      return res.status(404).json(error(['Profile not found.']));
    }

    if (user?.error) {
      logger.warn(`[AUTH][PROFILE] Business error for userId=${userId}: ${user.error}`);
      return res.status(400).json(error([user.error]));
    }

    logger.info(`[AUTH][PROFILE] Profile retrieved for userId=${userId}`);
    return res.status(200).json(success(user));

  } catch (err) {
    logger.error(`[AUTH][PROFILE] Unexpected error: ${err.message}`);
    return res.status(500).json(error(['Internal server error.']));
  }
};

module.exports = { getProfileController };
