const { success, error } = require('../../utils/response');
const { logger } = require('../../utils');
const { createUserService } = require('../../services/user');

const createUserController = async (req, res) => {
  try {
    const user = await createUserService(req.body);

    if (!user) {
      return res.status(409).json(error(['Email already used.']));
    }
    return res.status(201).json(success(user));
  } catch (err) {
    logger.error(`Error creating user: ${err.message}`);
    return res.status(500).json(error(['Internal server error.']));
  }
};

module.exports = { createUserController };
