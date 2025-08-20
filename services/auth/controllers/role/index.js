const { createRoleController } = require('./createRole.controller');
const { getRoleController }    = require('./getRole.controller');
const { listRolesController }   = require('./listRoles.controller');
const { updateRoleController } = require('./updateRole.controller');
const { deleteRoleController } = require('./deleteRole.controller');

const { logger } = require('../../utils');

[
  ['createRoleController', createRoleController],
  ['getRoleController', getRoleController],
  ['listRolesController', listRolesController],
  ['updateRoleController', updateRoleController],
  ['deleteRoleController', deleteRoleController]
].forEach(([name, fn]) => {
  if (typeof fn !== 'function') {
    logger.error(`❌ Contrôleur ${name} est undefined ou mal exporté`);
    throw new Error(`❌ Contrôleur ${name} est undefined ou mal exporté`);
  }
  logger.debug(`✅ Contrôleur ${name} chargé`);
});

module.exports = {
  createRoleController,
  getRoleController,
  listRolesController,
  updateRoleController,
  deleteRoleController
};
