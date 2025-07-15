const { z } = require('zod');

const createUserSchema = z.object({
  email: z.string().email({ message: 'Email invalide' }),
  password: z.string().min(6, { message: 'Mot de passe trop court (min 6 caractères)' }),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  birthDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Date de naissance invalide'
  }),
  role: z.enum(['user', 'employee', 'admin'])
});

module.exports = createUserSchema;
