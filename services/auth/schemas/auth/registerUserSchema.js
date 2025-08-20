// registerUser.schema.js
const { z } = require('zod');

const registerUserSchema = z.object({
  email: z.string().trim().toLowerCase().email({ message: 'Email invalide' }),
  password: z.string().min(6, { message: 'Mot de passe trop court (min 6 caractères)' }),
  firstName: z.string().trim().min(1).max(50).optional(),
  lastName: z.string().trim().min(1).max(50).optional()
}).strict();

module.exports = registerUserSchema;
