// middlewares/validateRequest.js
const { ZodError } = require('zod');
const { error } = require('../utils/response');

/**
 * Middleware de validation Zod générique
 * @param {ZodSchema} schema - Schéma Zod à appliquer
 * @param {'body'|'params'|'query'} [source='body'] - Partie de la requête à valider
 */
const validateRequest = (schema, source = 'body') => (req, res, next) => {
  if (!schema || typeof schema.parse !== 'function') {
    throw new TypeError(
      `Invalid Zod schema passed to validateRequest for source "${source}".`
    );
  }

  try {
    const validated = schema.parse(req[source]);
    // Permet d'accéder aux données validées partout ensuite
    req.validated = validated;
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      // Utilisation du helper error() pour respecter le format global
      return res.status(400).json(
        error(err.errors.map(e => e.message), 400)
      );
    }
    next(err);
  }
};

module.exports = validateRequest;
