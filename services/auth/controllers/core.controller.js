const { sendBusinessError } = require('../utils/sendError');
const { sendBusinessSuccess } = require('../utils/sendSuccess');
const { logger } = require('../utils');

/**
 * Masque les champs sensibles avant log
 */
const sanitize = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  const clone = { ...obj };
  if (clone.password) clone.password = '***';
  if (clone.token) clone.token = '***';
  if (clone.refreshToken) clone.refreshToken = '***';
  return clone;
};

/**
 * Fabrique générique de contrôleurs
 * - validate(req) → retourne un code d’erreur ou null
 * - service(req) → exécute la logique métier et retourne un résultat
 * - successType / successMsg / successCode → métadonnées de succès
 */
const makeController = ({ name, validate, service, successType, successMsg, successCode }) => {
  return async (req, res) => {
    const context = {
      controller: name,
      userId: req.user?.userId,
      role: req.user?.role,
      ip: req.ip,
      path: req.originalUrl,
      method: req.method
    };

    try {
      // Validation
      const validationError = validate?.(req);
      if (validationError) {
        logger.warn(`[CORE][${name}] Validation failed: ${validationError}`, {
          ...context,
          body: sanitize(req.body)
        });
        return sendBusinessError(res, validationError);
      }

      // Service
      const result = await service(req);

      if (result?.error) {
        logger.warn(`[CORE][${name}] Service returned error: ${result.error}`, {
          ...context
        });
        return sendBusinessError(res, result.error);
      }
      if (!result) {
        logger.info(`[CORE][${name}] No result found`, context);
        return sendBusinessError(res, 'NOT_FOUND');
      }

      // Succès → log audit
      logger.info(`[CORE][${name}] Success`, {
        ...context,
        successType,
        successMsg
      });

      return sendBusinessSuccess(res, successType, result, { message: successMsg }, successCode);
    } catch (err) {
      // 🔒 Log de veille sécurité
      logger.error(`[CORE][${name}] Unexpected error`, {
        ...context,
        error: err.message,
        stack: err.stack
      });
      return sendBusinessError(res, 'INTERNAL_SERVER_ERROR');
    }
  };
};

module.exports = { makeController };
