const { createRoleService } = require('./createRole.service');
const { getRoleService }    = require('./getRole.service');
const { listRolesService }   = require('./listRoles.service');
const { updateRoleService } = require('./updateRole.service');
const { deleteRoleService } = require('./deleteRole.service');

const { logger } = require('../../utils');

[
  ['createRoleService', createRoleService],
  ['getRoleService', getRoleService],
  ['listRolesService', listRolesService],
  ['updateRoleService', updateRoleService],
  ['deleteRoleService', deleteRoleService]
].forEach(([name, fn]) => {
  if (typeof fn !== 'function') {
    logger.error(`❌ Service ${name} est undefined ou mal exporté`);
    throw new Error(`❌ Service ${name} est undefined ou mal exporté`);
  }
  logger.debug(`✅ Service ${name} chargé`);
});

module.exports = {
  createRoleService,
  getRoleService,
  listRolesService,
  updateRoleService,
  deleteRoleService
};
