// controllers/auth/index.js
const { loginUserController }     = require('./loginUser.controller');
const { registerUserController }  = require('./registerUser.controller');
const { getProfileController }    = require('./getProfile.controller');
const { updateProfileController } = require('./updateProfile.controller');
const { deleteProfileController } = require('./deleteProfile.controller');

const { logger } = require('../../utils');

// Vérification stricte au chargement
[
  ['loginUserController', loginUserController],
  ['registerUserController', registerUserController],
  ['getProfileController', getProfileController],
  ['updateProfileController', updateProfileController],
  ['deleteProfileController', deleteProfileController]
].forEach(([name, fn]) => {
  if (typeof fn !== 'function') {
    logger.error(`❌ Contrôleur ${name} est undefined ou mal exporté`);
    throw new Error(`❌ Contrôleur ${name} est undefined ou mal exporté`);
  }
  logger.debug(`✅ Contrôleur ${name} chargé`);
});

module.exports = {
  loginUserController,
  registerUserController,
  getProfileController,
  updateProfileController,
  deleteProfileController
};
