const { success, error } = require('../../utils/response');
const { logger } = require('../../utils');
const { updateUserService } = require('../../services/user');

const updateUserController = async (req, res) => {
  try {
    const { id } = req.params;
    logger.debug(`[USER][UPDATE] Request to update user id=${id}`);

    if (req.user?.role !== 'ADMIN') {
      logger.warn(`[USER][UPDATE] Forbidden: non-admin tried to update user [id=${id}]`);
      return res.status(403).json(error(['FORBIDDEN']));
    }

    const parsedId = Number(id);
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      logger.warn(`[USER][UPDATE] Invalid user ID: ${id}`);
      return res.status(400).json(error(['INVALID_USER_ID']));
    }

    const updated = await updateUserService(parsedId, req.body);

    if (updated?.error) {
      logger.warn(`[USER][UPDATE] Business error for id=${parsedId}: ${updated.error}`);
      return res.status(400).json(error([updated.error]));
    }

    if (!updated) {
      logger.warn(`[USER][UPDATE] User not found [id=${parsedId}]`);
      return res.status(404).json(error(['USER_NOT_FOUND']));
    }

    logger.info(`[USER][UPDATE] User updated successfully [id=${parsedId}]`);
    return res
      .status(200)
      .json(success({ message: 'User updated.', user: updated }));

  } catch (err) {
    logger.error(`[USER][UPDATE] Internal error: ${err.message}`);
    return res.status(500).json(error(['Internal server error.']));
  }
};

module.exports = { updateUserController };
