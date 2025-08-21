// controllers/auth/getProfile.controller.js
const { success, error } = require('../../utils/response');
const { logger } = require('../../utils');
const { getProfileService } = require('../../services/auth');

const getProfileController = async (req, res) => {
  try {
    const userId = Number(req.user?.userId);
    logger.debug(`[AUTH][PROFILE] Fetching profile for userId=${userId}`);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json(error(['INVALID_ID']));
    }

    const result = await getProfileService(userId);

    if (!result) return res.status(404).json(error(['NOT_FOUND']));
    if (result.error) {
      return res.status(400).json(error([result.error]));
    }

    logger.info(`[AUTH][PROFILE] Profile retrieved for userId=${userId}`);
    return res.status(200).json(success(result));

  } catch (err) {
    logger.error(`[AUTH][PROFILE] Unexpected error: ${err.message}`);
    return res.status(500).json(error(['Internal server error.']));
  }
};

module.exports = { getProfileController };