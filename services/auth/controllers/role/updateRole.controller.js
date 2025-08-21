const { success, error } = require('../../utils/response');
const { logger } = require('../../utils');
const { updateRoleService } = require('../../services/role');

const updateRoleController = async (req, res) => {
  try {
    const roleId = req.params.id;

    if (req.user?.role !== 'ADMIN') {
      logger.warn(`[ROLE][UPDATE] Forbidden: non-admin tried to update role [id=${roleId}]`);
      return res.status(403).json(error(['FORBIDDEN']));
    }

    logger.debug(`[ROLE][UPDATE] Request to update role [id=${roleId}]`);

    const parsedId = Number(roleId);
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      logger.warn(`[ROLE][UPDATE] Invalid role ID: ${roleId}`);
      return res.status(400).json(error(['INVALID_ROLE_ID']));
    }

    const result = await updateRoleService(parsedId, req.body.role);

    if (result && result.error) {
      logger.warn(`[ROLE][UPDATE] Error updating role [id=${parsedId}]: ${result.error}`);
      switch (result.error) {
        case 'ROLE_REQUIRED':
        case 'INVALID_ROLE':
          return res.status(400).json(error([result.error]));
        case 'VISITOR_RESTRICTED':
          return res.status(403).json(error([result.error]));
        default:
          return res.status(400).json(error(['BAD_REQUEST']));
      }
    }

    if (result === null) {
      logger.warn(`[ROLE][UPDATE] Role not found [id=${parsedId}]`);
      return res.status(404).json(error(['ROLE_NOT_FOUND']));
    }

    logger.info(`[ROLE][UPDATE] Role updated successfully [id=${parsedId}]`);
    return res.status(200).json(success({ message: 'Role updated.', role: result }));

  } catch (err) {
    logger.error(`[ROLE][UPDATE] Unexpected error: ${err.message}`);
    return res.status(500).json(error(['Internal server error.']));
  }
};

module.exports = { updateRoleController };
