const { loginController }      = require('./login.controller');
const { registerUserController }   = require('./registerUser.controller');
const { getProfileController }     = require('./getProfile.controller');
const { updateProfileController }  = require('./updateProfile.controller');
const { deleteProfileController }  = require('./deleteProfile.controller');
const { logoutController }     = require('./logout.controller');
const { logger } = require('../../utils');

// Vérification stricte au chargement
[
  ['loginController', loginController],
  ['registerUserController', registerUserController],
  ['getProfileController', getProfileController],
  ['updateProfileController', updateProfileController],
  ['deleteProfileController', deleteProfileController],
  ['logoutController', logoutController],       // ← AJOUT
].forEach(([name, fn]) => {
  if (typeof fn !== 'function') {
    logger.error(`❌ Contrôleur ${name} est undefined ou mal exporté`);
    throw new Error(`❌ Contrôleur ${name} est undefined ou mal exporté`);
  }
  logger.debug(`✅ Contrôleur ${name} chargé`);
});

module.exports = {
  loginController,
  registerUserController,
  getProfileController,
  updateProfileController,
  deleteProfileController,
  logoutController,
};
