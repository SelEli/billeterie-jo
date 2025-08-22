// createUser.schema.js
const { z } = require('zod');

const createUserSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: 'Email invalide' }),

  password: z
    .string()
    .min(6, { message: 'Mot de passe trop court (min 6 caractères)' }),

  firstName: z
    .string()
    .trim()
    .min(1, { message: 'Prénom requis' })
    .max(50, { message: 'Prénom trop long' }),

  lastName: z
    .string()
    .trim()
    .min(1, { message: 'Nom requis' })
    .max(50, { message: 'Nom trop long' }),

  birthDate: z
    .string()
    .refine((val) => {
      // Vérifie que la date est valide et au format YYYY-MM-DD
      const d = new Date(val);
      return !isNaN(d) && /^\d{4}-\d{2}-\d{2}$/.test(val);
    }, {
      message: 'Date de naissance invalide. Format attendu : YYYY-MM-DD'
    }),

  role: z.enum(['USER', 'ADMIN', 'AGENT', 'EMPLOYEE', 'VISITOR'], {
    errorMap: () => ({ message: 'Rôle invalide' })
  })
}).strict();

module.exports = createUserSchema;
