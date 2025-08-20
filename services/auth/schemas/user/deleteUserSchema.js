const { z } = require('zod');

const deleteUserSchema = z.object({
  id: z.string().regex(/^\d+$/, { message: 'ID must be a numeric string' })
}).strict();

module.exports = deleteUserSchema;
