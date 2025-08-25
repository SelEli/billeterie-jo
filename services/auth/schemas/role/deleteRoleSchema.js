// schemas/role/deleteRole.schema.js
const { z } = require('zod');

const deleteRoleSchema = z.object({
  id: z.coerce.number().int().positive({ message: 'INVALID_ROLE_ID' })
}).strict();

module.exports = deleteRoleSchema;
