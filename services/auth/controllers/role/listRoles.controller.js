const { success, error } = require('../../utils/response');
const { logger } = require('../../utils');
const { listRoleService } = require('../../services/role');

const listRolesController = async (req, res) => {
  try {
    const roles = await listRoleService(req.query);

    if (!roles || roles.length === 0) {
      logger.warn('[ROLE][LIST] No roles found');
      return res.status(404).json(error(['No roles found.']));
    }

    return res.status(200).json(success(roles));
  } catch (err) {
    logger.error(`[ROLE][LIST] Internal error: ${err.message}`);
    return res.status(500).json(error(['Internal server error.']));
  }
};

module.exports = { listRolesController };
