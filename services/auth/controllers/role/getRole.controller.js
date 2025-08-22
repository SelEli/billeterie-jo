// controllers/role/getRole.controller.js
const { logger } = require('../../utils');
const { getRoleService } = require('../../services/role');
const { sendBusinessError } = require('../../utils/sendError');
const { sendBusinessSuccess } = require('../../utils/sendSuccess');

const getRoleController = async (req, res) => {
  try {
    const parsedId = Number(req.params.id);
    logger.debug(`[ROLE][GET] Fetching role [id=${parsedId}]`);

    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      return sendBusinessError(res, 'INVALID_ROLE_ID');
    }

    const role = await getRoleService(parsedId);

    if (role?.error) {
      return sendBusinessError(res, role.error);
    }

    if (!role) {
      return sendBusinessError(res, 'ROLE_NOT_FOUND');
    }

    return sendBusinessSuccess(res, 'READ_ONE', role);
  } catch (err) {
    logger.error(`[ROLE][GET] Unexpected error: ${err.message}`);
    return sendBusinessError(res, 'INTERNAL_SERVER_ERROR');
  }
};

module.exports = { getRoleController };
