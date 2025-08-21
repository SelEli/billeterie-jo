// controllers/role/listRoles.controller.js
const { success, error } = require('../../utils/response');
const { logger } = require('../../utils');
const { listRolesService } = require('../../services/role');

const listRolesController = async (req, res) => {
  try {
    logger.debug('[ROLE][LIST] Listing roles');
    const roles = await listRolesService(req.query);

    if (roles && roles.error) {
      logger.warn(`[ROLE][LIST] Business error: ${roles.error}`);
      return res.status(400).json(error([roles.error]));
    }

    if (!roles || roles.length === 0) {
      logger.warn('[ROLE][LIST] No roles found');
      return res.status(404).json(error(['No roles found.']));
    }

    logger.info(`[ROLE][LIST] Found ${roles.length} role(s)`);
    return res.status(200).json(success(roles));
  } catch (err) {
    logger.error(`[ROLE][LIST] Unexpected error: ${err.message}`);
    return res.status(500).json(error(['Internal server error.']));
  }
};

module.exports = { listRolesController };
