const { success, error } = require('../../utils/response');
const { logger } = require('../../utils');
const { readUserService } = require('../../services/user');

const readUserController = async (req, res) => {
  try {
    const user = await readUserService(req.params.id);

    if (!user) {
      return res.status(404).json(error(['User not found.']));
    }
    return res.status(200).json(success(user));
  } catch (err) {
    logger.error(`Error reading user: ${err.message}`);
    return res.status(500).json(error(['Internal server error.']));
  }
};

module.exports = { readUserController };
