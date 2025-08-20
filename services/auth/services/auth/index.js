const { registerUserService }  = require('./registerUser.service');
const { loginService }         = require('./login.service');
const { getProfileService }    = require('./getProfile.service');
const { updateProfileService } = require('./updateProfile.service');
const { deleteProfileService } = require('./deleteProfile.service');
const { logoutService }        = require('./logout.service'); // ← AJOUT

const { logger } = require('../../utils');

// Vérification stricte au chargement
[
  ['registerUserService', registerUserService],
  ['loginService', loginService],
  ['getProfileService', getProfileService],
  ['updateProfileService', updateProfileService],
  ['deleteProfileService', deleteProfileService],
  ['logoutService', logoutService]
].forEach(([name, fn]) => {
  if (typeof fn !== 'function') {
    logger.error(`❌ Service ${name} est undefined ou mal exporté`);
    throw new Error(`❌ Service ${name} est undefined ou mal exporté`);
  }
  logger.debug(`✅ Service ${name} chargé`);
});

module.exports = {
  registerUserService,
  loginService,
  getProfileService,
  updateProfileService,
  deleteProfileService,
  logoutService
};
