const { success, error } = require('../../utils/response');
const { logger } = require('../../utils');
const { deleteUserService } = require('../../services/user');

const deleteUserController = async (req, res) => {
  try {
    const result = await deleteUserService(req.params.id);

    if (!result) {
      return res.status(404).json(error(['User not found.']));
    }
    return res.status(204).json(success(null));
  } catch (err) {
    logger.error(`Error deleting user: ${err.message}`);
    return res.status(500).json(error(['Internal server error.']));
  }
};

module.exports = { deleteUserController };
