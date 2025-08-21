const { success, error } = require('../../utils/response');
const { logger } = require('../../utils');
const { listUsersService } = require('../../services/user');

const listUsersController = async (req, res) => {
  try {
    logger.debug('[USER][LIST] Fetching users list', { filters: req.query });

    if (req.query?.limit && isNaN(Number(req.query.limit))) {
      logger.warn('[USER][LIST] Invalid limit parameter');
      return res.status(400).json(error(['INVALID_QUERY_LIMIT']));
    }

    const users = await listUsersService(req.query);

    if (users?.error) {
      logger.warn(`[USER][LIST] Business error: ${users.error}`);
      return res.status(400).json(error([users.error]));
    }

    if (!users || users.length === 0) {
      logger.warn('[USER][LIST] No users found');
      return res.status(404).json(error(['NO_USERS_FOUND']));
    }

    logger.info(`[USER][LIST] Found ${users.length} user(s)`);
    return res
      .status(200)
      .json(success(users, { message: 'Users retrieved successfully' }));

  } catch (err) {
    logger.error(`[USER][LIST] Internal error: ${err.message}`);
    return res.status(500).json(error(['Internal server error.']));
  }
};

module.exports = { listUsersController };
