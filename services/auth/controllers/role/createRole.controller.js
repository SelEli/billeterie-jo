const { success, error } = require('../../utils/response');
const { logger } = require('../../utils');
const { createRoleService } = require('../../services/role');

const createRoleController = async (req, res) => {
  try {
    logger.debug('[ROLE][CREATE] Creating new role');
    const role = await createRoleService(req.body);

    if (!role) {
      logger.warn(`[ROLE][CREATE] Role already exists: ${req.body.name}`);
      return res.status(409).json(error(['Role already exists.']));
    }

    logger.info(`[ROLE][CREATE] Role created successfully: ${role.name}`);
    return res.status(201).json(success(role));
  } catch (err) {
    logger.error(`[ROLE][CREATE] Internal error: ${err.message}`);
    return res.status(500).json(error(['Internal server error.']));
  }
};

module.exports = { createRoleController };
