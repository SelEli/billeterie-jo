// controllers/role/getRole.controller.js
const { success, error } = require('../../utils/response');
const { logger } = require('../../utils');
const { getRoleService } = require('../../services/role');

const getRoleController = async (req, res) => {
  try {
    const roleId = req.params.id;
    logger.debug(`[ROLE][GET] Fetching role [id=${roleId}]`);

    const parsedId = Number(roleId);
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      logger.warn(`[ROLE][GET] Invalid role ID: ${roleId}`);
      return res.status(400).json(error(['Invalid role ID.']));
    }

    const role = await getRoleService(parsedId);

    if (role && role.error) {
      logger.warn(`[ROLE][GET] Business error for role [id=${parsedId}]: ${role.error}`);
      return res.status(400).json(error([role.error]));
    }

    if (!role) {
      logger.warn(`[ROLE][GET] Role not found [id=${parsedId}]`);
      return res.status(404).json(error(['Role not found.']));
    }

    logger.info(`[ROLE][GET] Retrieved role: ${role.name}`);
    return res.status(200).json(success(role));
  } catch (err) {
    logger.error(`[ROLE][GET] Unexpected error: ${err.message}`);
    return res.status(500).json(error(['Internal server error.']));
  }
};

module.exports = { getRoleController };
