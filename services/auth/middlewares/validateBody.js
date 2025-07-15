const { ZodError } = require('zod');

const validateBody = (schema) => {
  if (!schema || typeof schema.parse !== 'function') {
    throw new TypeError('Invalid Zod schema passed to validateBody.');
  }

  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          message: 'Validation error.',
          issues: err.errors
        });
      }
      return res.status(500).json({ message: 'Unexpected validation error.' });
    }
  };
};

module.exports = validateBody;
