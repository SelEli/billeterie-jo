// controllers/auth/updateProfile.controller.js
const { success, error } = require('../../utils/response');
const { logger } = require('../../utils');
const { updateProfileService } = require('../../services/auth');

const updateProfileController = async (req, res) => {
  try {
    logger.debug(`[AUTH][PROFILE][UPDATE] Attempting profile update for userId=${req.user?.userId}`);

    const updated = await updateProfileService(req.user.userId, req.body);

    if (!updated) {
      logger.warn(`[AUTH][PROFILE][UPDATE] Profile not found for userId=${req.user?.userId}`);
      return res.status(404).json(error(['Profile not found.']));
    }

    logger.info(`[AUTH][PROFILE][UPDATE] Profile updated for userId=${updated.id}`);
    return res.status(200).json(success(updated));
  } catch (err) {
    logger.error(`[AUTH][PROFILE][UPDATE] Internal error: ${err.message}`);
    return res.status(500).json(error(['Internal server error.']));
  }
};

module.exports = { updateProfileController };
