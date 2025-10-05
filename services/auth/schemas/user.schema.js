const { z } = require('zod');
const { strongPasswordRegex, validRoles, idSchema } = require('./core.schema');
const logger = require('../utils/logger');

// CREATE
const createUserSchema = z.object({
  email: z.string().trim().toLowerCase().email({ message: 'Email invalide' }),
  password: z.string().regex(strongPasswordRegex, {
    message: 'Le mot de passe doit contenir au moins 12 caractères, avec une majuscule, une minuscule, un chiffre et un caractère spécial'
  }),
  firstName: z.string().trim().min(1).max(50),
  lastName: z.string().trim().min(1).max(50),
  birthDate: z.string().refine((val) => {
    const d = new Date(val);
    return !isNaN(d) && /^\d{4}-\d{2}-\d{2}$/.test(val) && d <= new Date();
  }, { message: 'Date de naissance invalide ou future. Format attendu : YYYY-MM-DD' }),
  role: z.enum(validRoles, { errorMap: () => ({ message: 'Rôle invalide' }) }).optional() // ✅ optionnel
}).strict();


// DELETE
const deleteUserSchema = z.object({ id: idSchema }).strict();

// LIST
const listUsersSchema = z.object({
  email: z.string().min(1).optional(),
  role: z.enum(validRoles).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  sortBy: z.enum(['email', 'createdAt', 'firstName', 'lastName']).optional(),
  order: z.enum(['asc', 'desc']).optional()
}).strict();

// READ
const readUserSchema = z.object({ id: idSchema }).strict();

// UPDATE PROFILE (admin)
const updateProfileSchema = z.object({
  firstName: z.string().trim().min(1).max(50).optional(),
  lastName: z.string().trim().min(1).max(50).optional(),
  birthDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Date de naissance invalide'
  }).optional(),
  role: z.enum(validRoles, { errorMap: () => ({ message: 'Rôle invalide' }) }).optional()
}).strict();

// UPDATE USER (admin)
const updateUserSchema = z.object({
  email: z.string().trim().toLowerCase().email().optional(),
  password: z.string().regex(strongPasswordRegex, { message: 'Mot de passe invalide' }).optional(),
  firstName: z.string().trim().min(1).max(50).optional(),
  lastName: z.string().trim().min(1).max(50).optional(),
  birthDate: z.string().refine((val) => /^\d{4}-\d{2}-\d{2}$/.test(val) && !isNaN(Date.parse(val)), {
    message: 'Date de naissance invalide. Format attendu : YYYY-MM-DD'
  }).optional(),
  role: z.enum(validRoles, { errorMap: () => ({ message: 'Rôle invalide' }) }).optional(),
  isBlacklisted: z.boolean().optional(),
  blacklistReason: z.string().trim().max(255).optional()
}).strict();

const schemas = {
  createUserSchema,
  deleteUserSchema,
  listUsersSchema,
  readUserSchema,
  updateProfileSchema,
  updateUserSchema
};

Object.entries(schemas).forEach(([name, schema]) => {
  if (typeof schema !== 'object') throw new Error(`❌ Schéma ${name} invalide`);
});
logger.info(`✅ Schémas USER chargés : ${Object.keys(schemas).join(', ')}`);

module.exports = schemas;
