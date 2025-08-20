const { z } = require('zod');

const listRolesSchema = z.object({
  name: z.string().trim().min(1).optional()
}).strict();

module.exports = listRolesSchema;
