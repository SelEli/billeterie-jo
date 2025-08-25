// controllers/role/listRoles.controller.js
const { logger } = require('../../utils');
const { listRolesService } = require('../../services/role');
const { sendBusinessError } = require('../../utils/sendError');
const { sendBusinessSuccess } = require('../../utils/sendSuccess');

const listRolesController = async (req, res) => {
  try {
    logger.debug('[ROLE][LIST] Listing distinct roles from users');
    const result = await listRolesService();

    if (result?.error) {
      return sendBusinessError(res, result.error, 404);
    }

    return sendBusinessSuccess(res, 'READ_ROLE_LIST', result, null, 200);
  } catch (err) {
    logger.error(`[ROLE][LIST] Unexpected error: ${err.message}`);
    return sendBusinessError(res, 'INTERNAL_SERVER_ERROR', 500);
  }
};

module.exports = { listRolesController };
