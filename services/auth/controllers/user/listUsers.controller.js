// controllers/user/listUsers.controller.js
const { logger } = require('../../utils');
const { listUsersService } = require('../../services/user');
const { sendBusinessError } = require('../../utils/sendError');
const { sendBusinessSuccess } = require('../../utils/sendSuccess');

const listUsersController = async (req, res) => {
  try {
    logger.debug('[USER][LIST] Fetching users list', { filters: req.query });

    // Vérification manuelle du paramètre limit si non filtré par Zod
    if (req.query?.limit && isNaN(Number(req.query.limit))) {
      return sendBusinessError(res, 'INVALID_QUERY_LIMIT', 400);
    }

    // Appel du service
    const result = await listUsersService(req.query);

    // Gestion des erreurs métier
    if (result?.error) {
      const statusMap = {
        INVALID_ROLE: 400
        // NO_USERS_FOUND n'est plus mappé ici : succès même si vide
      };
      return sendBusinessError(res, result.error, statusMap[result.error] || 400);
    }

    // Réponse enrichie avec pagination dans meta
    return sendBusinessSuccess(
      res,
      'READ_LIST',
      result.users, // tableau (peut être vide)
      {
        message: 'Users retrieved successfully',
        pagination: result.pagination
      },
      200
    );
  } catch (err) {
    logger.error(`[USER][LIST] Internal error: ${err.message}`);
    return sendBusinessError(res, 'INTERNAL_SERVER_ERROR', 500);
  }
};

module.exports = { listUsersController };

