// controllers/auth/deleteProfile.controller.js
const { error } = require('../../utils/response');
const { logger } = require('../../utils');
const { deleteProfileService } = require('../../services/auth');

const deleteProfileController = async (req, res) => {
  try {
    const userId = Number(req.user?.userId);
    logger.debug(`[AUTH][DELETE_PROFILE] Self-delete request for userId=${userId}`);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json(error(['INVALID_ID']));
    }

    const deleted = await deleteProfileService(userId);

    if (!deleted) return res.status(404).json(error(['NOT_FOUND']));

    logger.info(`[AUTH][DELETE_PROFILE] Profile deleted [id=${userId}]`);
    return res.status(204).end();

  } catch (err) {
    logger.error(`[AUTH][DELETE_PROFILE] Unexpected error: ${err.message}`);
    return res.status(500).json(error(['Internal server error.']));
  }
};

module.exports = { deleteProfileController };