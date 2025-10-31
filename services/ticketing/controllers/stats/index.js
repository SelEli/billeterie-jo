const { getStatsController } = require('./getStats.controller');

const logger = require('../../utils/logger');

// Vérification stricte des contrôleurs
[
  ['getStatsController', getStatsController]
].forEach(([name, fn]) => {
  if (typeof fn !== 'function') {
    logger.error(`❌ Contrôleur ${name} est undefined ou mal exporté`);
    throw new Error(`❌ Contrôleur ${name} est undefined ou mal exporté`);
  }
  logger.debug(`✅ Contrôleur ${name} chargé`);
});

module.exports = {
  getStatsController
};
