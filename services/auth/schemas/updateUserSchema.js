const { z } = require('zod');

const updateUserSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  role: z.enum(['user', 'employee', 'admin']).optional()
})
.strict();

module.exports = updateUserSchema;
