const { z } = require('zod');

const updateUserSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  birthDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Date de naissance invalide'
  }).optional(),
  role: z.enum(['USER', 'ADMIN', 'AGENT', 'EMPLOYEE', 'VISITOR']).optional(),
  isBlacklisted: z.boolean().optional(),
  blacklistReason: z.string().max(255).optional()
}).strict();

module.exports = updateUserSchema;
