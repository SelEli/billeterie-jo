const { success, error } = require('../../utils/response');
const { logger } = require('../../utils');
const { updateUserService } = require('../../services/user');

const updateUserController = async (req, res) => {
  try {
    const updated = await updateUserService(req.params.id, req.body);

    if (!updated) {
      return res.status(404).json(error(['User not found.']));
    }
    return res.status(200).json(success({ message: 'User updated.', user: updated }));
  } catch (err) {
    logger.error(`Error updating user: ${err.message}`);
    return res.status(500).json(error(['Internal server error.']));
  }
};

module.exports = { updateUserController };
