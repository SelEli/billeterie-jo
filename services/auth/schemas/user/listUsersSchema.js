const { z } = require('zod');

const listUsersSchema = z.object({
  email: z.string().email().optional(),
  role: z.enum(['USER', 'ADMIN', 'AGENT', 'EMPLOYEE', 'VISITOR']).optional()
}).strict();

module.exports = listUsersSchema;
