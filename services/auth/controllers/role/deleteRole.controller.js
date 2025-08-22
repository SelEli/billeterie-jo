// controllers/role/deleteRole.controller.js
const { logger } = require('../../utils');
const { deleteRoleService } = require('../../services/role');
const { sendBusinessError } = require('../../utils/sendError');
const { sendBusinessSuccess } = require('../../utils/sendSuccess');

const deleteRoleController = async (req, res) => {
  try {
    const parsedId = Number(req.params.id);
    logger.debug(`[ROLE][DELETE] Request to delete role [id=${parsedId}]`);

    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      return sendBusinessError(res, 'INVALID_ROLE_ID');
    }

    const deleted = await deleteRoleService(parsedId);

    if (deleted?.error) {
      return sendBusinessError(res, deleted.error);
    }

    if (!deleted) {
      return sendBusinessError(res, 'ROLE_NOT_FOUND');
    }

    return sendBusinessSuccess(res, 'DELETE');
  } catch (err) {
    logger.error(`[ROLE][DELETE] Unexpected error: ${err.message}`);
    return sendBusinessError(res, 'INTERNAL_SERVER_ERROR');
  }
};

module.exports = { deleteRoleController };
