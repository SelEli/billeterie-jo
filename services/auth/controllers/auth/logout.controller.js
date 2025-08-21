// controllers/auth/logout.controller.js
const { success, error } = require('../../utils/response');
const { logger } = require('../../utils');
const { logoutService } = require('../../services/auth');

const logoutController = async (req, res) => {
  try {
    const userId = req.user?.userId;
    logger.debug(`[AUTH][LOGOUT] Request to logout userId=${userId}`);

    if (!userId) {
      logger.warn('[AUTH][LOGOUT] Missing authenticated user ID');
      return res.status(400).json(error(['Invalid user context.']));
    }

    await logoutService(req.user); // délégation au service

    logger.info(`[AUTH][LOGOUT] User ${userId} logged out successfully`);
    return res
      .status(200)
      .json(success({ message: 'Logged out successfully.' }));

  } catch (err) {
    logger.error(`[AUTH][LOGOUT] Unexpected error: ${err.message}`);
    return res.status(500).json(error(['Internal server error.']));
  }
};

module.exports = { logoutController };
