// schemas/role/updateRole.schema.js
const { z } = require('zod');

const validRoles = ['VISITOR', 'USER', 'ADMIN', 'EMPLOYEE', 'AGENT'];

const updateRoleSchema = z.object({
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

module.exports = updateRoleSchema;
