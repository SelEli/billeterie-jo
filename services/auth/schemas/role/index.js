const createRoleSchema = require('./createRoleSchema');
const getRoleSchema    = require('./getRoleSchema');
const listRoleSchema   = require('./listRolesSchema');
const updateRoleSchema = require('./updateRoleSchema');
const deleteRoleSchema = require('./deleteRoleSchema');

const { logger } = require('../../utils');

[
  ['createRoleSchema', createRoleSchema],
  ['getRoleSchema', getRoleSchema],
  ['listRoleSchema', listRoleSchema],
  ['updateRoleSchema', updateRoleSchema],
  ['deleteRoleSchema', deleteRoleSchema]
].forEach(([name, schema]) => {
  if (!schema) {
    logger.error(`❌ Schéma ${name} est undefined ou mal exporté`);
    throw new Error(`❌ Schéma ${name} est undefined ou mal exporté`);
  }
  logger.debug(`✅ Schéma ${name} chargé`);
});

module.exports = {
  createRoleSchema,
  getRoleSchema,
  listRolesSchema,
  updateRoleSchema,
  deleteRoleSchema
};
