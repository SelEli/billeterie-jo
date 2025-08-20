// middlewares/validateRequest.js
const { ZodError } = require('zod');

/**
 * Middleware de validation Zod générique
 * @param {ZodSchema} schema - Schéma Zod à appliquer
 * @param {'body'|'params'|'query'} [source='body'] - Partie de la requête à valider
 *
 * En cas d'erreur, renvoie un JSON structuré :
 * {
 *   status: 'error',
 *   data: null,
 *   errors: [ 'Message 1', 'Message 2', ... ],
 *   meta: {}
 * }
 */
const validateRequest = (schema, source = 'body') => (req, res, next) => {
  if (!schema || typeof schema.parse !== 'function') {
    throw new TypeError(`Invalid Zod schema passed to validateRequest for source "${source}".`);
  }

  try {
    const validated = schema.parse(req[source]);
    // Permet d'accéder aux données validées partout ensuite
    req.validated = validated;
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        status: 'error',
        data: null,
        errors: err.errors.map(e => e.message),
        meta: {}
      });
    }
    next(err);
  }
};

module.exports = validateRequest;
