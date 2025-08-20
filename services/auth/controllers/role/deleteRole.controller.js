const { success, error } = require('../../utils/response');
const { logger } = require('../../utils');
const { deleteRoleService } = require('../../services/role');

const deleteRoleController = async (req, res) => {
  try {
    const deleted = await deleteRoleService(req.params.id);

    if (!deleted) {
      logger.warn(`[ROLE][DELETE] Role not found [id=${req.params.id}]`);
      return res.status(404).json(error(['Role not found.']));
    }

    logger.info(`[ROLE][DELETE] Role deleted successfully [id=${req.params.id}]`);
    return res.status(204).json(success(null));
  } catch (err) {
    logger.error(`[ROLE][DELETE] Internal error: ${err.message}`);
    return res.status(500).json(error(['Internal server error.']));
  }
};

module.exports = { deleteRoleController };
