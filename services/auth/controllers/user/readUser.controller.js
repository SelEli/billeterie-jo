const { success, error } = require('../../utils/response');
const { logger } = require('../../utils');
const { readUserService } = require('../../services/user');

const readUserController = async (req, res) => {
  try {
    const { id } = req.params;
    logger.debug(`[USER][READ] Fetching user id=${id}`);

    const parsedId = Number(id);
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      logger.warn(`[USER][READ] Invalid user ID: ${id}`);
      return res.status(400).json(error(['INVALID_USER_ID']));
    }

    const user = await readUserService(parsedId);

    if (user?.error) {
      logger.warn(`[USER][READ] Business error for id=${parsedId}: ${user.error}`);
      switch (user.error) {
        case 'FORBIDDEN':
          return res.status(403).json(error(['FORBIDDEN']));
        case 'USER_DEACTIVATED':
          return res.status(423).json(error(['USER_DEACTIVATED']));
        default:
          return res.status(400).json(error([user.error]));
      }
    }

    if (!user) {
      logger.warn(`[USER][READ] User not found [id=${parsedId}]`);
      return res.status(404).json(error(['USER_NOT_FOUND']));
    }

    logger.info(`[USER][READ] User found [id=${parsedId}]`);
    return res
      .status(200)
      .json(success(user, { message: 'User retrieved successfully' }));

  } catch (err) {
    logger.error(`[USER][READ] Internal error: ${err.message}`);
    return res.status(500).json(error(['Internal server error.']));
  }
};

module.exports = { readUserController };
