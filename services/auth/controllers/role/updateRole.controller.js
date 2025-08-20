// controllers/role/updateRole.controller.js
const { success, error } = require('../../utils/response');
const { logger } = require('../../utils');
const { updateRoleService } = require('../../services/role');

const updateRoleController = async (req, res) => {
  try {
    logger.debug(`[ROLE][UPDATE] Request to update role for userId=${req.params.id}`);

    const result = await updateRoleService(req.params.id, req.body.role);

    if (result === null) {
      logger.warn(`[ROLE][UPDATE] User not found [id=${req.params.id}]`);
      return res.status(404).json(error(['User not found.']));
    }

    if (result?.error) {
      logger.warn(`[ROLE][UPDATE] Error updating role for [id=${req.params.id}]: ${result.error}`);
      switch (result.error) {
        case 'INVALID_ID':
        case 'ROLE_REQUIRED':
        case 'INVALID_ROLE':
          return res.status(400).json(error([result.error]));
        case 'VISITOR_RESTRICTED':
          return res.status(403).json(error([result.error]));
        default:
          return res.status(400).json(error(['Bad request']));
      }
    }

    logger.info(`[ROLE][UPDATE] Role updated successfully for userId=${req.params.id}`);
    return res.status(200).json(success({ message: 'Role updated.', user: result }));
  } catch (err) {
    logger.error(`[ROLE][UPDATE] Internal error: ${err.message}`);
    return res.status(500).json(error(['Internal server error.']));
  }
};

module.exports = { updateRoleController };
