// controllers/auth/logout.controller.js
const { logger } = require('../../utils');
const { logoutService } = require('../../services/auth');
const { sendBusinessError } = require('../../utils/sendError');
const { sendBusinessSuccess } = require('../../utils/sendSuccess');

const logoutController = async (req, res) => {
  try {
    const userId = req.user?.userId;
    logger.debug(`[AUTH][LOGOUT] Request to logout userId=${userId}`);

    if (!userId) {
      return sendBusinessError(res, 'UNAUTHORIZED');
    }

    await logoutService(req.user);

    return sendBusinessSuccess(res, 'LOGOUT', { message: 'Logged out successfully' });
  } catch (err) {
    logger.error(`[AUTH][LOGOUT] Unexpected error: ${err.message}`);
    return sendBusinessError(res, 'INTERNAL_SERVER_ERROR');
  }
};

module.exports = { logoutController };
