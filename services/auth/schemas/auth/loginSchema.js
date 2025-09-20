// login.schema.js
const { z } = require('zod');

const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{12,}$/;

const loginSchema = z.object({
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
}).strict();

module.exports = loginSchema;
