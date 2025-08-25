// controllers/role/createRole.controller.js
const { logger } = require('../../utils');
const { createRoleService } = require('../../services/role');
const { sendBusinessError } = require('../../utils/sendError');
const { sendBusinessSuccess } = require('../../utils/sendSuccess');

const createRoleController = async (req, res) => {
  try {
    const { userId, role } = req.body;
    logger.debug(`[ROLE][CREATE] Assigning role ${role} to user ${userId}`);

    if (!userId || !Number.isInteger(Number(userId)) || Number(userId) <= 0) {
      return sendBusinessError(res, 'INVALID_ROLE_ID', 400);
    }
    if (!role || typeof role !== 'string' || !role.trim()) {
      return sendBusinessError(res, 'ROLE_REQUIRED', 400);
    }

    const result = await createRoleService({ userId, role });

    if (result?.error) {
      const statusMap = {
        USER_NOT_FOUND: 404,
        INVALID_ROLE_ID: 400,
        ROLE_REQUIRED: 400,
        INVALID_ROLE: 400
      };
      return sendBusinessError(res, result.error, statusMap[result.error] || 400);
    }

    return sendBusinessSuccess(
      res,
      'CREATE_ROLE',
      result,
      { message: 'Role assigned successfully' },
      201
    );
  } catch (err) {
    logger.error(`[ROLE][CREATE] Unexpected error: ${err.message}`, { stack: err.stack });
    return sendBusinessError(res, 'INTERNAL_SERVER_ERROR', 500);
  }
};

module.exports = { createRoleController };
