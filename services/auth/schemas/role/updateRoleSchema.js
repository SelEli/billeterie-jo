// schemas/updateRoleSchema.js
const { z } = require('zod');

const updateRoleSchema = z.object({
  role: z.enum(['USER', 'ADMIN', 'AGENT', 'EMPLOYEE', 'VISITOR'])
}).strict();

module.exports = updateRoleSchema;
