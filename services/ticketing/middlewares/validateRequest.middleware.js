// services/ticketing/middlewares/validateRequest.middleware.js
const { ZodError } = require('zod');
const { sendBusinessError } = require('../utils/sendError');

/**
 * Middleware de validation Zod générique
 * @param {ZodSchema} schema - Schéma Zod à appliquer
 * @param {'body'|'params'|'query'} [source='body'] - Partie de la requête à valider
 * @param {string} [errorCode='INVALID_DATA'] - Code métier à renvoyer en cas d'erreur
 */
const validateRequest = (schema, source = 'body', errorCode = 'INVALID_DATA') => (req, res, next) => {
  try {
    const validated = schema.parse(req[source]);
    req.validated = validated;
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      return sendBusinessError(
        res,
        errorCode,
        err.errors.map(e => `${e.path.join('.')}: ${e.message}`)
      );
    }
    next(err);
  }
};

module.exports = validateRequest;
