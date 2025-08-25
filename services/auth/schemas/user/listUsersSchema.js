const { z } = require('zod');

const listUsersSchema = z.object({
  email: z.string().min(1).optional(), // autorise recherche partielle
  role: z.enum(['USER', 'ADMIN', 'AGENT', 'EMPLOYEE', 'VISITOR']).optional(),
  limit: z
    .string()
    .regex(/^\d+$/, { message: 'INVALID_QUERY_LIMIT' })
    .transform(Number)
    .optional(),
  page: z
    .string()
    .regex(/^\d+$/, { message: 'INVALID_QUERY_PAGE' })
    .transform(Number)
    .optional(),
  sortBy: z.enum(['email', 'createdAt', 'firstName', 'lastName']).optional(),
  order: z.enum(['asc', 'desc']).optional()
}).strict();

module.exports = listUsersSchema;
