// schemas/user/index.js
const createUserSchema    = require('./createUserSchema');
const registerUserSchema  = require('./registerUserSchema');
const updateProfileSchema = require('./updateProfileSchema');
const updateUserSchema    = require('./updateUserSchema');
const listUsersSchema     = require('./listUsersSchema');
const readUserSchema      = require('./readUsersSchema');
const deleteUserSchema    = require('./deleteUserSchema');

const { logger } = require('../../utils');

// Vérification stricte au chargement
[
  ['createUserSchema', createUserSchema],
  ['registerUserSchema', registerUserSchema],
  ['updateProfileSchema', updateProfileSchema],
  ['updateUserSchema', updateUserSchema],
  ['listUsersSchema', listUsersSchema],
  ['readUserSchema', readUserSchema],
  ['deleteUserSchema', deleteUserSchema]
].forEach(([name, schema]) => {
  if (!schema) {
    logger.error(`❌ Schéma ${name} est undefined ou mal exporté`);
    throw new Error(`❌ Schéma ${name} est undefined ou mal exporté`);
  }
  logger.debug(`✅ Schéma ${name} chargé`);
});

module.exports = {
  createUserSchema,
  registerUserSchema,
  updateProfileSchema,
  updateUserSchema,
  listUsersSchema,
  readUserSchema,
  deleteUserSchema
};
