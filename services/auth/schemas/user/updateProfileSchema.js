// updateProfile.schema.js (version admin)
const { z } = require('zod');

const updateProfileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, { message: 'Prénom requis' })
    .max(50, { message: 'Prénom trop long' })
    .optional(),

  lastName: z
    .string()
    .trim()
    .min(1, { message: 'Nom requis' })
    .max(50, { message: 'Nom trop long' })
    .optional(),

  birthDate: z
    .string()
    .refine(
      (val) => !isNaN(Date.parse(val)),
      { message: 'Date de naissance invalide' }
    )
    .optional(),

  role: z
    .enum(['USER', 'ADMIN', 'AGENT', 'EMPLOYEE', 'VISITOR'], {
      errorMap: () => ({ message: 'Rôle invalide' })
    })
    .optional()
}).strict();

module.exports = updateProfileSchema;
