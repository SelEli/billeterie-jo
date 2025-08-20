const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const roleRoutes = require('./role.routes');   // ajout pour le rôle
const healthRoutes = require('./health');

// Vérification stricte des routeurs au chargement
[
  ['authRoutes', authRoutes],
  ['userRoutes', userRoutes],
  ['roleRoutes', roleRoutes],
  ['healthRoutes', healthRoutes]
].forEach(([name, r]) => {
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

// Montage des sous-routeurs
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/role', roleRoutes);   // montage du routeur role
router.use('/health', healthRoutes);

module.exports = router;
