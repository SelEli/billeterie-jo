// schemas/role/getRole.schema.js
const { z } = require('zod');

const getRoleSchema = z.object({
  id: z.coerce.number().int().positive({ message: 'INVALID_ROLE_ID' })
}).strict();

module.exports = getRoleSchema;
