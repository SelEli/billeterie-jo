// controllers/role/listRoles.controller.js
const { logger } = require('../../utils');
const { listRolesService } = require('../../services/role');
const { sendBusinessError } = require('../../utils/sendError');
const { sendBusinessSuccess } = require('../../utils/sendSuccess');

const listRolesController = async (req, res) => {
  try {
    logger.debug('[ROLE][LIST] Listing roles');
    const roles = await listRolesService(req.query);

    if (roles?.error) {
      return sendBusinessError(res, roles.error);
    }

    if (!roles || roles.length === 0) {
      return sendBusinessError(res, 'NO_ROLES_FOUND');
    }

    return sendBusinessSuccess(res, 'READ_LIST', roles);
  } catch (err) {
    logger.error(`[ROLE][LIST] Unexpected error: ${err.message}`);
    return sendBusinessError(res, 'INTERNAL_SERVER_ERROR');
  }
};

module.exports = { listRolesController };
