// controllers/role/updateRole.controller.js
const { logger } = require('../../utils');
const { updateRoleService } = require('../../services/role');
const { sendBusinessError } = require('../../utils/sendError');
const { sendBusinessSuccess } = require('../../utils/sendSuccess');

const updateRoleController = async (req, res) => {
  try {
    const parsedId = Number(req.params.id);

    if (req.user?.role !== 'ADMIN') {
      return sendBusinessError(res, 'FORBIDDEN');
    }

    logger.debug(`[ROLE][UPDATE] Request to update role [id=${parsedId}]`);

    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      return sendBusinessError(res, 'INVALID_ROLE_ID');
    }

    const result = await updateRoleService(parsedId, req.body.role);

    if (result?.error) {
      return sendBusinessError(res, result.error);
    }

    if (result === null) {
      return sendBusinessError(res, 'ROLE_NOT_FOUND');
    }

    return sendBusinessSuccess(res, 'UPDATE_ROLE', { message: 'Role updated.', role: result });
  } catch (err) {
    logger.error(`[ROLE][UPDATE] Unexpected error: ${err.message}`);
    return sendBusinessError(res, 'INTERNAL_SERVER_ERROR');
  }
};

module.exports = { updateRoleController };
