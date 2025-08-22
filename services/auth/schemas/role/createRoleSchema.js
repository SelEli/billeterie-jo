// createRole.schema.js
const { z } = require('zod');

const createRoleSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: 'Role name must be at least 2 characters long.' })
    .max(50, { message: 'Role name must be at most 50 characters long.' })
    .regex(/^[A-Z0-9_]+$/, {
      message: 'Role name must be uppercase letters, numbers or underscores only.'
    }),

  permissions: z
    .array(
      z
        .string()
        .trim()
        .min(1, { message: 'Permission name cannot be empty.' })
    )
    .optional()
    .default([])
}).strict();

module.exports = createRoleSchema;
