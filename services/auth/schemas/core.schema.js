const { z } = require('zod');

// Regex mot de passe fort
const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{12,}$/;

// Rôles valides
const validRoles = ['VISITOR', 'USER', 'ADMIN', 'EMPLOYEE', 'AGENT'];

// ID positif (coercion string → number)
const idSchema = z.coerce.number().int().positive({ message: 'INVALID_ID' });

// Regex YYYY-MM-DD
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

// Date uniforme (YYYY-MM-DD, pas future)
const dateSchema = z.string().refine((val) => {
  if (!dateRegex.test(val)) return false;
  const d = new Date(val);
  return !isNaN(d) && d <= new Date();
}, { message: 'Date invalide ou future. Format attendu : YYYY-MM-DD' });

module.exports = {
  strongPasswordRegex,
  validRoles,
  idSchema,
  dateSchema
};
