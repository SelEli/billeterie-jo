// routes/index.js
const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

// Import des sous‑routeurs
const ticketRoutes = require('./ticket.routes');
const eventRoutes  = require('./event.routes');
const offerRoutes  = require('./offer.routes');
const healthRoutes = require('./health');
const statsRoutes  = require('./stats.routes'); // ✅ ajout

// Vérification stricte des routeurs au chargement
[
  ['ticketRoutes', ticketRoutes],
  ['eventRoutes', eventRoutes],
  ['offerRoutes', offerRoutes],
  ['healthRoutes', healthRoutes],
  ['statsRoutes', statsRoutes] // ✅ ajout
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

// Montage des sous‑routeurs
router.use('/ticket', ticketRoutes);
router.use('/event',  eventRoutes);
router.use('/offer',  offerRoutes);
router.use('/health', healthRoutes);
router.use('/stats',  statsRoutes); // ✅ ajout

module.exports = router;
