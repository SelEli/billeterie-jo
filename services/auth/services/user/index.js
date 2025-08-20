const { createUserService } = require('./createUser.service');
const { readUserService }   = require('./readUser.service');
const { listUsersService }  = require('./listUsers.service');
const { updateUserService } = require('./updateUser.service');
const { deleteUserService } = require('./deleteUser.service');

const { logger } = require('../../utils');

[
  ['createUserService', createUserService],
  ['readUserService', readUserService],
  ['listUsersService', listUsersService],
  ['updateUserService', updateUserService],
  ['deleteUserService', deleteUserService]
].forEach(([name, fn]) => {
  if (typeof fn !== 'function') {
    logger.error(`❌ Service ${name} est undefined ou mal exporté`);
    throw new Error(`❌ Service ${name} est undefined ou mal exporté`);
  }
  logger.debug(`✅ Service ${name} chargé`);
});

module.exports = {
  createUserService,
  readUserService,
  listUsersService,
  updateUserService,
  deleteUserService
};
