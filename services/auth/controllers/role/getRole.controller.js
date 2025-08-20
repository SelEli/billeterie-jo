const { success, error } = require('../../utils/response');
const { logger } = require('../../utils');
const { getRoleService } = require('../../services/role');

const getRoleController = async (req, res) => {
  try {
    const role = await getRoleService(req.params.id);

    if (!role) {
      logger.warn(`[ROLE][GET] Role not found [id=${req.params.id}]`);
      return res.status(404).json(error(['Role not found.']));
    }

    logger.info(`[ROLE][GET] Retrieved role: ${role.name}`);
    return res.status(200).json(success(role));
  } catch (err) {
    logger.error(`[ROLE][GET] Internal error: ${err.message}`);
    return res.status(500).json(error(['Internal server error.']));
  }
};

module.exports = { getRoleController };
