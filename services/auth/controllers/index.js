const authControllers = require('./auth.controller');
const userControllers = require('./user.controller');
const roleControllers = require('./role.controller');
const logger = require('../utils/logger');

// Vérification stricte des groupes de contrôleurs
const groups = {
  auth: authControllers,
  user: userControllers,
  role: roleControllers
};

const invalid = Object.entries(groups).filter(
  ([, group]) => typeof group !== 'object' || group === null
);

if (invalid.length > 0) {
  invalid.forEach(([name]) => {
    logger.error(`❌ Groupe ${name} est undefined ou mal exporté`);
  });
  throw new Error(`❌ ${invalid.length} groupe(s) de contrôleurs invalides détectés`);
}

// 🔒 Log unique de sécurité
logger.info(`✅ Tous les groupes de contrôleurs (${Object.keys(groups).length}) ont été chargés et validés`);

module.exports = groups;
