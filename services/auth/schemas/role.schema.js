const { z } = require('zod');
const { validRoles, idSchema } = require('./core.schema');
const logger = require('../utils/logger');

// CREATE
const createRoleSchema = z.object({
  userId: idSchema,
  role: z.enum(validRoles, {
    errorMap: (issue) => {
      if (issue.code === 'invalid_type' && issue.received === 'undefined') {
        return { message: 'ROLE_REQUIRED' };
      }
      return { message: 'INVALID_ROLE' };
    }
  })
}).strict();

// DELETE
const deleteRoleSchema = z.object({ id: idSchema }).strict();

// GET ONE
const getRoleSchema = z.object({ id: idSchema }).strict();

// LIST
const listRolesSchema = z.object({
  role: z.enum(validRoles).optional()
}).strict();

// UPDATE
const updateRoleSchema = z.object({
  role: z.enum(validRoles, {
    errorMap: (issue) => {
      if (issue.code === 'invalid_type' && issue.received === 'undefined') {
        return { message: 'ROLE_REQUIRED' };
      }
      return { message: 'INVALID_ROLE' };
    }
  })
}).strict();

const schemas = {
  createRoleSchema,
  deleteRoleSchema,
  getRoleSchema,
  listRolesSchema,
  updateRoleSchema
};

Object.entries(schemas).forEach(([name, schema]) => {
  if (typeof schema !== 'object') throw new Error(`❌ Schéma ${name} invalide`);
});
logger.info(`✅ Schémas ROLE chargés : ${Object.keys(schemas).join(', ')}`);

module.exports = schemas;
