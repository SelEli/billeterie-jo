// ===== AUTH =====
const authServices = require('./auth.service');

// ===== USER =====
const userServices = require('./user.service');

// ===== ROLE =====
const roleServices = require('./role.service');

const { logger } = require('../utils');

// On regroupe tout dans un seul objet
const services = {
  ...authServices,
  ...userServices,
  ...roleServices
};

// Vérification stricte : toutes les valeurs doivent être des fonctions
const invalid = Object.entries(services).filter(([_, fn]) => typeof fn !== 'function');

if (invalid.length > 0) {
  invalid.forEach(([name]) => {
    logger.error(`❌ Service ${name} est undefined ou mal exporté`);
  });
  throw new Error(`❌ ${invalid.length} service(s) invalides détectés`);
}

// ✅ Log unique de sécurité
logger.info(`✅ Tous les services (${Object.keys(services).length}) ont été chargés et validés`);

module.exports = services;
