const { ZodError } = require('zod');

/**
 * Middleware de validation Zod.
 * En cas d'erreur, renvoie un JSON structuré avec status "error" et une liste d'erreurs.
 */
const validateRequest = (schema) => (req, res, next) => {
  try {
    const validated = schema.parse(req.body);
    req.validated = validated;
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        status: 'error',
        errors: err.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
    }

    // Erreur inconnue : on la passe au handler global
    next(err);
  }
};

module.exports = validateRequest;
