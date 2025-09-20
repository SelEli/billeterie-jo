// registerUser.schema.js
const { z } = require('zod');

// Regex : au moins 12 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial
const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{12,}$/;

const registerUserSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: 'Email invalide' }),

  password: z
    .string()
    .regex(strongPasswordRegex, {
      message:
        'Le mot de passe doit contenir au moins 12 caractères, avec une majuscule, une minuscule, un chiffre et un caractère spécial',
    }),

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
