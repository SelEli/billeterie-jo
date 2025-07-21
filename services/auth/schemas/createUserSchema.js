const { z } = require('zod');

const createUserSchema = z.object({
  email: z.string().email({ message: 'Email invalide' }),
  password: z.string().min(6, { message: 'Mot de passe trop court (min 6 caractères)' }),
  firstName: z.string().min(1, { message: 'Prénom requis' }).max(50, { message: 'Prénom trop long' }),
  lastName: z.string().min(1, { message: 'Nom requis' }).max(50, { message: 'Nom trop long' }),
  birthDate: z.string().refine((val) => {
    const d = new Date(val);
    return !isNaN(d) && d.toISOString().startsWith(val);
  }, {
    message: 'Date de naissance invalide. Format attendu : YYYY-MM-DD'
  }),
  role: z.enum(['USER', 'ADMIN', 'AGENT', 'EMPLOYEE'], {
    errorMap: () => ({ message: 'Rôle invalide' })
  })
});

module.exports = createUserSchema;
