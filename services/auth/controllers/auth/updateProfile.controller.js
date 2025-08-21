// controllers/auth/updateProfile.controller.js
const { success, error } = require('../../utils/response');
const { logger } = require('../../utils');
const { updateProfileService } = require('../../services/auth');

const updateProfileController = async (req, res) => {
  try {
    const userId = Number(req.user?.userId);
    logger.debug(`[AUTH][PROFILE][UPDATE] Attempting profile update for userId=${userId}`);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json(error(['INVALID_ID']));
    }

    const result = await updateProfileService(userId, req.body);

    if (!result) return res.status(404).json(error(['NOT_FOUND']));
    if (result.error) {
      return res.status(400).json(error([result.error]));
    }

    logger.info(`[AUTH][PROFILE][UPDATE] Profile updated for userId=${result.id}`);
    return res
      .status(200)
      .json(success(result, { message: 'Profile updated successfully' }));

  } catch (err) {
    logger.error(`[AUTH][PROFILE][UPDATE] Unexpected error: ${err.message}`);
    return res.status(500).json(error(['Internal server error.']));
  }
};

module.exports = { updateProfileController };