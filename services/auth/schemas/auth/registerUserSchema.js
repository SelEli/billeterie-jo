// registerUser.schema.js
const { z } = require('zod');

const registerUserSchema = z.object({
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
    .max(50, { message: 'Prénom trop long (max 50 caractères)' })
    .optional(),

  lastName: z
    .string()
    .trim()
    .min(1, { message: 'Nom requis' })
    .max(50, { message: 'Nom trop long (max 50 caractères)' })
    .optional(),

  birthDate: z
    .string()
    .refine(
      (val) => !isNaN(Date.parse(val)),
      { message: 'Date de naissance invalide' }
    )
    .optional()
}).strict(); // interdit toute autre clé (ex: role)

module.exports = registerUserSchema;
