const { z } = require('zod');

const createRoleSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: 'Role name must be at least 2 characters long.' })
    .max(50, { message: 'Role name must be at most 50 characters long.' }),
  permissions: z
    .array(z.string().trim())
    .optional()
    .default([])
}).strict();

module.exports = createRoleSchema;
