const { success, error } = require('../../utils/response');
const { logger } = require('../../utils');
const { createRoleService } = require('../../services/role');

const createRoleController = async (req, res) => {
  try {
    const { name, description } = req.body;
    logger.debug(`[ROLE][CREATE] Creating new role: ${name}`);

    if (!name || typeof name !== 'string' || !name.trim()) {
      logger.warn('[ROLE][CREATE] Missing or invalid role name');
      return res.status(400).json(error(['ROLE_NAME_REQUIRED']));
    }

    const role = await createRoleService({ name: name.trim(), description });

    if (role === null) {
      logger.warn(`[ROLE][CREATE] Role already exists: ${name}`);
      return res.status(409).json(error(['ROLE_EXISTS']));
    }

    if (role && role.error) {
      logger.warn(`[ROLE][CREATE] Business error: ${role.error}`);
      return res.status(400).json(error([role.error]));
    }

    logger.info(`[ROLE][CREATE] Role created successfully: ${role.name}`);
    return res.status(201).json(success(role, { message: 'Role created successfully' }));

  } catch (err) {
    logger.error(`[ROLE][CREATE] Unexpected error: ${err.message}`);
    return res.status(500).json(error(['Internal server error.']));
  }
};

module.exports = { createRoleController };
