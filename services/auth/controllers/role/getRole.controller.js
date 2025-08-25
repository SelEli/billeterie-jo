// controllers/role/getRole.controller.js
const { logger } = require('../../utils');
const { getRoleService } = require('../../services/role');
const { sendBusinessError } = require('../../utils/sendError');
const { sendBusinessSuccess } = require('../../utils/sendSuccess');

const getRoleController = async (req, res) => {
  try {
    const parsedId = Number(req.params.id);
    logger.debug(`[ROLE][GET] Fetching role for user [id=${parsedId}]`);

    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      return sendBusinessError(res, 'INVALID_ROLE_ID', 400);
    }

    const result = await getRoleService(parsedId);

    if (result?.error) {
      return sendBusinessError(res, result.error, 400);
    }

    if (!result) {
      return sendBusinessError(res, 'USER_NOT_FOUND', 404);
    }

    return sendBusinessSuccess(res, 'READ_ROLE', result, null, 200);
  } catch (err) {
    logger.error(`[ROLE][GET] Unexpected error: ${err.message}`);
    return sendBusinessError(res, 'INTERNAL_SERVER_ERROR', 500);
  }
};

module.exports = { getRoleController };
