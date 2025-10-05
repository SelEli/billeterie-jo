const { z } = require('zod');
const { strongPasswordRegex } = require('./core.schema');
const logger = require('../utils/logger');

// LOGIN
const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email({ message: 'Email invalide' }),
  password: z.string().regex(strongPasswordRegex, {
    message: 'Le mot de passe doit contenir au moins 12 caractères, avec une majuscule, une minuscule, un chiffre et un caractère spécial'
  })
}).strict();

// LOGOUT
const logoutSchema = z.object({}).strict();

// REGISTER
const registerUserSchema = z.object({
  email: z.string().trim().toLowerCase().email({ message: 'Email invalide' }),
  password: z.string().regex(strongPasswordRegex, {
    message: 'Le mot de passe doit contenir au moins 12 caractères, avec une majuscule, une minuscule, un chiffre et un caractère spécial'
  }),
  firstName: z.string().trim().min(1).max(50).optional(),
  lastName: z.string().trim().min(1).max(50).optional(),
  birthDate: z.string().refine((val) => {
    const d = new Date(val);
    return !isNaN(d) && d <= new Date();
  }, { message: 'Date de naissance invalide ou future' }).optional()
}).strict();

// UPDATE PROFILE
const updateProfileSchema = z.object({
  firstName: z.string().trim().min(1).max(50).optional(),
  lastName: z.string().trim().min(1).max(50).optional(),
  birthDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Date de naissance invalide'
  }).optional()
}).strict();

const schemas = { loginSchema, logoutSchema, registerUserSchema, updateProfileSchema };

// Vérification stricte + log unique
Object.entries(schemas).forEach(([name, schema]) => {
  if (typeof schema !== 'object') throw new Error(`❌ Schéma ${name} invalide`);
});
logger.info(`✅ Schémas AUTH chargés : ${Object.keys(schemas).join(', ')}`);

module.exports = schemas;
