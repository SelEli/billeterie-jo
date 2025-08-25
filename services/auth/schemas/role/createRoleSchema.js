// schemas/role/createRole.schema.js
const { z } = require('zod');

const validRoles = ['VISITOR', 'USER', 'ADMIN', 'EMPLOYEE', 'AGENT'];

const createRoleSchema = z.object({
  userId: z.number().int().positive({ message: 'USER_ID_REQUIRED' }),
  role: z.enum(validRoles, {
    errorMap: (issue) => {
      if (issue.code === 'invalid_type' && issue.received === 'undefined') {
        return { message: 'ROLE_REQUIRED' };
      }
      if (issue.code === 'invalid_enum_value') {
        return { message: 'INVALID_ROLE' };
      }
      return { message: 'INVALID_ROLE' };
    }
  })
}).strict();

module.exports = createRoleSchema;
