// schemas/user/readUser.schema.js
const { z } = require('zod');

const readUserSchema = z.object({
  id: z.coerce.number().int().positive({ message: 'INVALID_USER_ID' })
}).strict();

module.exports = readUserSchema;
