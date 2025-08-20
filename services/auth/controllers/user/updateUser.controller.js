// controllers/user/updateUser.controller.js
const { success, error } = require('../../utils/response');
const { logger } = require('../../utils');
const { updateUserService } = require('../../services/user');

const updateUserController = async (req, res) => {
  try {
    logger.debug(`[USER][UPDATE] Request to update user id=${req.params.id}`);

    // Garde d’accès (comme pour role/update)
    if (req.user?.role !== 'ADMIN') {
      logger.warn(`[USER][UPDATE] Forbidden: non-admin tried to update user [id=${req.params.id}]`);
      return res.status(403).json(error(['Forbidden']));
    }

    const updated = await updateUserService(req.params.id, req.body);

    if (updated?.error) {
      logger.warn(`[USER][UPDATE] Business error for id=${req.params.id}: ${updated.error}`);
      return res.status(400).json(error([updated.error]));
    }

    if (!updated) {
      logger.warn(`[USER][UPDATE] User not found [id=${req.params.id}]`);
      return res.status(404).json(error(['User not found.']));
    }

    logger.info(`[USER][UPDATE] User updated successfully [id=${req.params.id}]`);
    return res.status(200).json(success({ message: 'User updated.', user: updated }));
  } catch (err) {
    logger.error(`[USER][UPDATE] Unexpected error: ${err.message}`);
    return res.status(500).json(error(['Internal server error.']));
  }
};

module.exports = { updateUserController };
