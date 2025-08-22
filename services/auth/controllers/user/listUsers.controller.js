// controllers/user/listUsers.controller.js
const { logger } = require('../../utils');
const { listUsersService } = require('../../services/user');
const { sendBusinessError } = require('../../utils/sendError');
const { sendBusinessSuccess } = require('../../utils/sendSuccess');

const listUsersController = async (req, res) => {
  try {
    logger.debug('[USER][LIST] Fetching users list', { filters: req.query });

    if (req.query?.limit && isNaN(Number(req.query.limit))) {
      return sendBusinessError(res, 'INVALID_QUERY_LIMIT');
    }

    const users = await listUsersService(req.query);

    if (users?.error) {
      return sendBusinessError(res, users.error);
    }

    if (!users || users.length === 0) {
      return sendBusinessError(res, 'NO_USERS_FOUND');
    }

    return sendBusinessSuccess(res, 'READ_LIST', users, { message: 'Users retrieved successfully' });
  } catch (err) {
    logger.error(`[USER][LIST] Internal error: ${err.message}`);
    return sendBusinessError(res, 'INTERNAL_SERVER_ERROR');
  }
};

module.exports = { listUsersController };
