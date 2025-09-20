// updateUser.schema.js (version admin)
const { z } = require('zod');

// Regex : au moins 12 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial
const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{12,}$/;

const updateUserSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: 'Email invalide' })
    .optional(),

  password: z
    .string()
    .regex(strongPasswordRegex, {
      message:
        'Le mot de passe doit contenir au moins 12 caractères, avec une majuscule, une minuscule, un chiffre et un caractère spécial',
    })
    .optional(),

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
      (val) => /^\d{4}-\d{2}-\d{2}$/.test(val) && !isNaN(Date.parse(val)),
      { message: 'Date de naissance invalide. Format attendu : YYYY-MM-DD' }
    )
    .optional(),

  role: z
    .enum(['USER', 'ADMIN', 'AGENT', 'EMPLOYEE', 'VISITOR'], {
      errorMap: () => ({ message: 'Rôle invalide' })
    })
    .optional(),

  isBlacklisted: z.boolean().optional(),

  blacklistReason: z
    .string()
    .trim()
    .max(255, { message: 'Raison trop longue (max 255 caractères)' })
    .optional()
}).strict();

module.exports = updateUserSchema;
