// controllers/role/updateRole.controller.js
const { logger } = require('../../utils');
const { updateRoleService } = require('../../services/role');
const { sendBusinessError } = require('../../utils/sendError');
const { sendBusinessSuccess } = require('../../utils/sendSuccess');

const updateRoleController = async (req, res) => {
  try {
    const parsedId = Number(req.params.id);

    if (req.user?.role !== 'ADMIN') {
      return sendBusinessError(res, 'FORBIDDEN', 403);
    }

    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      return sendBusinessError(res, 'INVALID_ROLE_ID', 400);
    }

    const roleValue = req.body?.role ?? req.body?.name;
    if (!roleValue) {
      return sendBusinessError(res, 'ROLE_REQUIRED', 400);
    }

    const validRoles = ['ADMIN', 'AGENT', 'USER', 'VISITOR', 'EMPLOYEE'];
    if (typeof roleValue === 'string' && !validRoles.includes(roleValue.toUpperCase())) {
      return sendBusinessError(res, 'INVALID_ROLE', 400);
    }

    const result = await updateRoleService(parsedId, roleValue);

    if (result?.error) {
      const statusMap = {
        USER_NOT_FOUND: 404,
        INVALID_ROLE_ID: 400,
        ROLE_REQUIRED: 400,
        INVALID_ROLE: 400
      };
      return sendBusinessError(res, result.error, statusMap[result.error] || 400);
    }

    if (!result) {
      return sendBusinessError(res, 'USER_NOT_FOUND', 404);
    }

    return sendBusinessSuccess(res, 'UPDATE_ROLE', result, { message: 'Role updated.' }, 200);
  } catch (err) {
    logger.error(`[ROLE][UPDATE] Unexpected error: ${err.message}`, { stack: err.stack });
    return sendBusinessError(res, 'INTERNAL_SERVER_ERROR', 500);
  }
};

module.exports = { updateRoleController };
