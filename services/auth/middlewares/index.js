const validateRequest = require('./validateRequest.middleware');
const authenticate = require('./auth.middleware');
const logger = require('../utils/logger');

// Vérification stricte au chargement
[
  ['validateRequest', validateRequest],
  ['authenticate', authenticate]
].forEach(([name, fn]) => {
  if (typeof fn !== 'function') {
    logger.error(`❌ Middleware ${name} est undefined ou mal exporté`);
    throw new Error(`❌ Middleware ${name} est undefined ou mal exporté`);
  }
  logger.debug(`✅ Middleware ${name} chargé`);
});

module.exports = {
  validateRequest,
  authenticate
};
