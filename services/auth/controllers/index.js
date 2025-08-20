const authControllers = require('./auth');
const userControllers = require('./user');
const roleControllers = require('./role');
const logger = require('../utils/logger');

// Vérification des groupes de contrôleurs
[
  ['authControllers', authControllers],
  ['userControllers', userControllers],
  ['roleControllers', roleControllers]
].forEach(([name, group]) => {
  if (typeof group !== 'object' || group === null) {
    logger.error(`❌ Groupe ${name} est undefined ou mal exporté`);
    throw new Error(`❌ Groupe ${name} est undefined ou mal exporté`);
  }
  logger.debug(`✅ Groupe ${name} chargé`);
});

module.exports = {
  auth: authControllers,
  user: userControllers,
  role: roleControllers
};
