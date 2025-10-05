const { z } = require('zod');

// Regex mot de passe fort
const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{12,}$/;

// Rôles valides
const validRoles = ['VISITOR', 'USER', 'ADMIN', 'EMPLOYEE', 'AGENT'];

// ID positif (coercion string → number)
const idSchema = z.coerce.number().int().positive({ message: 'INVALID_ID' });

module.exports = {
  strongPasswordRegex,
  validRoles,
  idSchema
};
