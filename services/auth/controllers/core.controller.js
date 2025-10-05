const { sendBusinessError } = require('../utils/sendError');
const { sendBusinessSuccess } = require('../utils/sendSuccess');
const { logger } = require('../utils');

/**
 * Fabrique générique de contrôleurs
 * - validate(req) → retourne un code d’erreur ou null
 * - service(req) → exécute la logique métier et retourne un résultat
 * - successType / successMsg / successCode → métadonnées de succès
 */
const makeController = ({ name, validate, service, successType, successMsg, successCode }) => {
  return async (req, res) => {
    try {
      const validationError = validate?.(req);
      if (validationError) {
        return sendBusinessError(res, validationError);
      }

      const result = await service(req);

      if (result?.error) {
        return sendBusinessError(res, result.error);
      }
      if (!result) {
        return sendBusinessError(res, 'NOT_FOUND');
      }

      return sendBusinessSuccess(res, successType, result, { message: successMsg }, successCode);
    } catch (err) {
      // 🔒 Log de veille sécurité uniquement
      logger.error(`[CORE][${name}] Unexpected error: ${err.message}`);
      return sendBusinessError(res, 'INTERNAL_SERVER_ERROR');
    }
  };
};

module.exports = { makeController };
