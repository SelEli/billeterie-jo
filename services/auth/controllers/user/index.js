// controllers/user/index.js
const { createUserController } = require('./createUser.controller');
const { readUserController }   = require('./readUser.controller');
const { updateUserController } = require('./updateUser.controller');
const { deleteUserController } = require('./deleteUser.controller');
const { listUsersController }  = require('./listUsers.controller');

const { logger } = require('../../utils');

// Vérification stricte au chargement
[
  ['createUserController', createUserController],
  ['readUserController', readUserController],
  ['updateUserController', updateUserController],
  ['deleteUserController', deleteUserController],
  ['listUsersController', listUsersController]
].forEach(([name, fn]) => {
  if (typeof fn !== 'function') {
    logger.error(`❌ Contrôleur ${name} est undefined ou mal exporté`);
    throw new Error(`❌ Contrôleur ${name} est undefined ou mal exporté`);
  }
  logger.debug(`✅ Contrôleur ${name} chargé`);
});

module.exports = {
  createUserController,
  readUserController,
  updateUserController,
  deleteUserController,
  listUsersController
};
