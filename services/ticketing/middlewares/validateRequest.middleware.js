const { ZodError } = require('zod');
const { sendBusinessError } = require('../utils/sendError');

/**
 * Middleware de validation Zod générique
 * @param {ZodSchema} schema - Schéma Zod à appliquer
 * @param {'body'|'params'|'query'} [source='body'] - Partie de la requête à valider
 */
const validateRequest = (schema, source = 'body') => (req, res, next) => {
  try {
    const validated = schema.parse(req[source]);
    req.validated = validated;
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      // On renvoie via ton helper, avec un code métier cohérent
      return sendBusinessError(
        res,
        'INVALID_EVENT_DATA', // ou 'INVALID_OFFER_DATA' / 'INVALID_TICKET_DATA' selon le contexte
        err.errors.map(e => `${e.path.join('.')}: ${e.message}`)
      );
    }
    next(err);
  }
};

module.exports = validateRequest;
