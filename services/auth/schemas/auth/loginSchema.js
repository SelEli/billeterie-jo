// login.schema.js
const { z } = require('zod');

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email({ message: 'Email invalide' }),
  password: z.string().min(6, { message: 'Mot de passe trop court (min 6 caractères)' })
}).strict();

module.exports = loginSchema;
