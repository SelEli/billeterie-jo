const { ZodError } = require('zod');

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
