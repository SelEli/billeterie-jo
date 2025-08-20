// ===== AUTH =====
const authServices = require('./auth');

// ===== USER =====
const userServices = require('./user');

// ===== ROLE =====
const roleServices = require('./role');

const { logger } = require('../utils');

// On regroupe tout dans un seul objet
const services = {
  ...authServices,
  ...userServices,
  ...roleServices
};

// Vérification stricte : toutes les valeurs doivent être des fonctions
Object.entries(services).forEach(([name, fn]) => {
  if (typeof fn !== 'function') {
    logger.error(`❌ Service ${name} est undefined ou mal exporté`);
    throw new Error(`❌ Service ${name} est undefined ou mal exporté`);
  }
  logger.debug(`✅ Service ${name} chargé`);
});

module.exports = services;
