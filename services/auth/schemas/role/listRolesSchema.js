// schemas/role/listRoles.schema.js
const { z } = require('zod');

const validRoles = ['VISITOR', 'USER', 'ADMIN', 'EMPLOYEE', 'AGENT'];

const listRolesSchema = z.object({
  role: z.enum(validRoles).optional()
}).strict();

module.exports = listRolesSchema;
