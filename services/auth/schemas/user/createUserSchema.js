// createUser.schema.js
const { z } = require('zod');

// Regex : au moins 12 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial
const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{12,}$/;

const createUserSchema = z
  .object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email({ message: 'Email invalide' }),

    password: z
      .string()
      .min(12, { message: 'Le mot de passe doit contenir au moins 12 caractères' })
      .regex(strongPasswordRegex, {
        message:
          'Le mot de passe doit contenir au moins 12 caractères, avec une majuscule, une minuscule, un chiffre et un caractère spécial',
      }),

    firstName: z
      .string()
      .trim()
      .min(1, { message: 'Prénom requis' })
      .max(50, { message: 'Prénom trop long (max 50 caractères)' }),

    lastName: z
      .string()
      .trim()
      .min(1, { message: 'Nom requis' })
      .max(50, { message: 'Nom trop long (max 50 caractères)' }),

    birthDate: z
      .string()
      .refine((val) => {
        const d = new Date(val);
        // Vérifie que la date est valide, au format YYYY-MM-DD et pas dans le futur
        return !isNaN(d) && /^\d{4}-\d{2}-\d{2}$/.test(val) && d <= new Date();
      }, {
        message: 'Date de naissance invalide ou future. Format attendu : YYYY-MM-DD'
      }),

    role: z.enum(['USER', 'ADMIN', 'AGENT', 'EMPLOYEE', 'VISITOR'], {
      errorMap: () => ({ message: 'Rôle invalide' })
    })
  })
  .strict(); // interdit toute autre clé

module.exports = createUserSchema;
