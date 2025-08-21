// controllers/role/deleteRole.controller.js
const { success, error } = require('../../utils/response');
const { logger } = require('../../utils');
const { deleteRoleService } = require('../../services/role');

const deleteRoleController = async (req, res) => {
  try {
    const roleId = req.params.id;
    logger.debug(`[ROLE][DELETE] Request to delete role [id=${roleId}]`);

    // Validation ID
    const parsedId = Number(roleId);
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      logger.warn(`[ROLE][DELETE] Invalid role ID: ${roleId}`);
      return res.status(400).json(error(['Invalid role ID.']));
    }

    const deleted = await deleteRoleService(parsedId);

    if (deleted && deleted.error) {
      logger.warn(`[ROLE][DELETE] Business error for role [id=${parsedId}]: ${deleted.error}`);
      return res.status(400).json(error([deleted.error]));
    }

    if (!deleted) {
      logger.warn(`[ROLE][DELETE] Role not found [id=${parsedId}]`);
      return res.status(404).json(error(['Role not found.']));
    }

    logger.info(`[ROLE][DELETE] Role deleted successfully [id=${parsedId}]`);
    return res.status(204).end();
  } catch (err) {
    logger.error(`[ROLE][DELETE] Unexpected error: ${err.message}`);
    return res.status(500).json(error(['Internal server error.']));
  }
};

module.exports = { deleteRoleController };
