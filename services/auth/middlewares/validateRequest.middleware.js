const { ZodError } = require('zod');

/**
 * Middleware de validation Zod.
 * En cas d'erreur, renvoie un JSON structuré selon le contrat API strict :
 * - status: 'error'
 * - data: null
 * - errors: tableau de chaînes non vide
 * - meta: {}
 */
const validateRequest = (schema) => (req, res, next) => {
  if (!schema || typeof schema.parse !== 'function') {
    throw new TypeError('Invalid Zod schema passed to validateRequest.');
  }

  try {
    const validated = schema.parse(req.body);
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

    // Erreur inconnue → handler global
    next(err);
  }
};

module.exports = validateRequest;
