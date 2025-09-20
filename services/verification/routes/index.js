const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

const verificationRoutes = require('./verification.routes');

// Vérification stricte comme Auth
[['verificationRoutes', verificationRoutes]].forEach(([name, r]) => {
  if (typeof r !== 'function' && typeof r.use !== 'function') {
    logger.error(`❌ Routeur ${name} est undefined ou mal exporté`);
    throw new Error(`❌ Routeur ${name} est undefined ou mal exporté`);
  }
  logger.debug(`✅ Routeur ${name} chargé`);
});

// Logger debug global
router.use((req, res, next) => {
  logger.debug(`[MAIN ROUTER] ${req.method} ${req.originalUrl}`);
  next();
});

// Montage identique à Auth
router.use('/verification', verificationRoutes);

module.exports = router;
