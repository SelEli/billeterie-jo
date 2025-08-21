const { error } = require('../../utils/response');
const { logger } = require('../../utils');
const { deleteUserService } = require('../../services/user');

const deleteUserController = async (req, res) => {
  try {
    logger.debug(`[USER][DELETE] Request to delete user id=${req.params.id}`);

    const parsedId = Number(req.params.id);
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      logger.warn(`[USER][DELETE] Invalid user ID: ${req.params.id}`);
      return res.status(400).json(error(['INVALID_USER_ID']));
    }

    const result = await deleteUserService(parsedId);

    if (result?.error) {
      logger.warn(`[USER][DELETE] Business error for id=${parsedId}: ${result.error}`);
      return res.status(400).json(error([result.error]));
    }

    if (!result) {
      logger.warn(`[USER][DELETE] User not found [id=${parsedId}]`);
      return res.status(404).json(error(['USER_NOT_FOUND']));
    }

    logger.info(`[USER][DELETE] User deleted successfully [id=${parsedId}]`);
    return res.status(204).end();

  } catch (err) {
    logger.error(`[USER][DELETE] Internal error: ${err.message}`);
    return res.status(500).json(error(['Internal server error.']));
  }
};

module.exports = { deleteUserController };
