// controllers/user/readUser.controller.js
const { logger } = require('../../utils');
const { readUserService } = require('../../services/user');
const { sendBusinessError } = require('../../utils/sendError');
const { sendBusinessSuccess } = require('../../utils/sendSuccess');

const readUserController = async (req, res) => {
  try {
    const parsedId = Number(req.params.id);
    logger.debug(`[USER][READ] Fetching user [id=${parsedId}]`);

    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      return sendBusinessError(res, 'INVALID_USER_ID', 400);
    }

    const user = await readUserService(parsedId);

    if (user?.error) {
      return sendBusinessError(res, user.error, 400);
    }

    if (!user) {
      return sendBusinessError(res, 'USER_NOT_FOUND', 404);
    }

    return sendBusinessSuccess(res, 'READ_ONE', user, null, 200);
  } catch (err) {
    logger.error(`[USER][READ] Internal error: ${err.message}`);
    return sendBusinessError(res, 'INTERNAL_SERVER_ERROR', 500);
  }
};

module.exports = { readUserController };
