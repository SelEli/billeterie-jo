const { success, error } = require('../../utils/response');
const { logger } = require('../../utils');
const { listUsersService } = require('../../services/user');

const listUsersController = async (req, res) => {
  try {
    const users = await listUsersService(req.query);

    if (!users || users.length === 0) {
      logger.warn('[USER][LIST] No users found');
      return res.status(404).json(error(['No users found.']));
    }

    return res.status(200).json(success(users));
  } catch (err) {
    logger.error(`[USER][LIST] Internal error: ${err.message}`);
    return res.status(500).json(error(['Internal server error.']));
  }
};

module.exports = { listUsersController };
