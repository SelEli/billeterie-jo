// schemas/deleteRoleSchema.js
const { z } = require('zod');

const deleteRoleSchema = z.object({
  id: z.string().regex(/^\d+$/, { message: 'ID must be a numeric string' })
}).strict();

module.exports = deleteRoleSchema;
