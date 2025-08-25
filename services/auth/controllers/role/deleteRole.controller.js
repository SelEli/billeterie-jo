// controllers/role/deleteRole.controller.js
const { logger } = require('../../utils');
const { deleteRoleService } = require('../../services/role');
const { sendBusinessError } = require('../../utils/sendError');
const { sendBusinessSuccess } = require('../../utils/sendSuccess');

const deleteRoleController = async (req, res) => {
  try {
    const parsedId = Number(req.params.id);
    logger.debug(`[ROLE][DELETE] Resetting role for user [id=${parsedId}]`);

    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      return sendBusinessError(res, 'INVALID_ROLE_ID', 400);
    }

    const result = await deleteRoleService(parsedId);

    if (result?.error) {
      return sendBusinessError(res, result.error, 400);
    }

    if (!result) {
      return sendBusinessError(res, 'USER_NOT_FOUND', 404);
    }

    return sendBusinessSuccess(res, 'DELETE_ROLE', result, { message: 'Role reset to VISITOR' }, 200);
  } catch (err) {
    logger.error(`[ROLE][DELETE] Unexpected error: ${err.message}`, { stack: err.stack });
    return sendBusinessError(res, 'INTERNAL_SERVER_ERROR', 500);
  }
};

module.exports = { deleteRoleController };
