// controllers/role/createRole.controller.js
const { logger } = require('../../utils');
const { createRoleService } = require('../../services/role');
const { sendBusinessError } = require('../../utils/sendError');
const { sendBusinessSuccess } = require('../../utils/sendSuccess');

const createRoleController = async (req, res) => {
  try {
    const { name, description } = req.body;
    logger.debug(`[ROLE][CREATE] Creating new role: ${name}`);

    if (!name || typeof name !== 'string' || !name.trim()) {
      return sendBusinessError(res, 'ROLE_NAME_REQUIRED');
    }

    const role = await createRoleService({ name: name.trim(), description });

    if (role?.error) {
      return sendBusinessError(res, role.error);
    }

    if (role === null) {
      return sendBusinessError(res, 'ROLE_EXISTS');
    }

    return sendBusinessSuccess(res, 'CREATE_ROLE', role, { message: 'Role created successfully' });
  } catch (err) {
    logger.error(`[ROLE][CREATE] Unexpected error: ${err.message}`);
    return sendBusinessError(res, 'INTERNAL_SERVER_ERROR');
  }
};

module.exports = { createRoleController };
