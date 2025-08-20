// controllers/role/index.js
const { updateUserRoleController } = require('./updateUserRole.controller');
const { logger } = require('../../utils');

// Vérification stricte au chargement
[
  ['updateUserRoleController', updateUserRoleController]
].forEach(([name, fn]) => {
  if (typeof fn !== 'function') {
    logger.error(`❌ Contrôleur ${name} est undefined ou mal exporté`);
    throw new Error(`❌ Contrôleur ${name} est undefined ou mal exporté`);
  }
  logger.debug(`✅ Contrôleur ${name} chargé`);
});

module.exports = {
  updateUserRoleController
};
