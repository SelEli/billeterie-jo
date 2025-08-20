const registerUserSchema   = require('./registerUserSchema');
const updateProfileSchema  = require('./updateProfileSchema');
const loginSchema      = require('./loginSchema');
const logoutSchema     = require('./logoutSchema');

const { logger } = require('../../utils');

// Vérification stricte au chargement
[
  ['registerUserSchema', registerUserSchema],
  ['updateProfileSchema', updateProfileSchema],
  ['loginSchema', loginSchema],
  ['logoutSchema', logoutSchema]
].forEach(([name, schema]) => {
  if (!schema) {
    logger.error(`❌ Schéma ${name} est undefined ou mal exporté`);
    throw new Error(`❌ Schéma ${name} est undefined ou mal exporté`);
  }
  logger.debug(`✅ Schéma ${name} chargé`);
});

module.exports = {
  registerUserSchema,
  updateProfileSchema,
  loginSchema,
  logoutSchema
};
