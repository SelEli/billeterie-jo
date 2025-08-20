// controllers/user/readUser.controller.js
const { success, error } = require('../../utils/response');
const { logger } = require('../../utils');
const { readUserService } = require('../../services/user');

const readUserController = async (req, res) => {
  try {
    const { id } = req.params;
    logger.debug(`[USER][READ] Fetching user id=${id}`);

    // ID invalide
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      logger.warn(`[USER][READ] Invalid user ID: ${id}`);
      return res.status(400).json(error(['Invalid user ID.']));
    }

    const user = await readUserService(parsedId);

    // Gestion d'erreur métier éventuelle
    if (user?.error) {
      logger.warn(`[USER][READ] Business error for id=${parsedId}: ${user.error}`);
      return res.status(400).json(error([user.error]));
    }

    // Aucun utilisateur trouvé
    if (!user) {
      logger.warn(`[USER][READ] User not found [id=${parsedId}]`);
      return res.status(404).json(error(['User not found.']));
    }

    // Succès
    logger.info(`[USER][READ] User found [id=${parsedId}]`);
    return res.status(200).json(success(user));

  } catch (err) {
    logger.error(`[USER][READ] Unexpected error: ${err.message}`);
    return res.status(500).json(error(['Internal server error.']));
  }
};

module.exports = { readUserController };
