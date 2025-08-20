// controllers/auth/logout.controller.js
const { success, error } = require('../../utils/response');
const { logger } = require('../../utils');
const { logoutService } = require('../../services/auth');

const logoutController = async (req, res) => {
  try {
    await logoutService(req.user); // délégation au service
    return res
      .status(200)
      .json(success({ message: 'Logged out successfully.' }));
  } catch (err) {
    logger.error(`[AUTH][LOGOUT] Error: ${err.message}`);
    return res
      .status(500)
      .json(error(['Internal server error.']));
  }
};

module.exports = { logoutController };
