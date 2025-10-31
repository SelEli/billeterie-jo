/**
 * Stats Routes
 * ------------
 * Ce fichier définit toutes les routes REST liées aux statistiques :
 *   - Nombre de tickets par Event
 *   - Nombre de tickets par Offer
 *   - Nombre total de tickets
 *
 * Points clés :
 *   - Auth obligatoire (ADMIN uniquement)
 *   - Logs détaillés pour chaque appel
 *   - Vérification stricte des contrôleurs importés
 */

const express = require('express');
const router = express.Router();

const authenticate = require('../middlewares/auth.middleware');
const logger = require('../utils/logger');

const { getStatsController } = require('../controllers/stats/getStats.controller');

// Vérification stricte des contrôleurs importés
[
  ['getStatsController', getStatsController]
].forEach(([name, fn]) => {
  if (typeof fn !== 'function') {
    throw new Error(`❌ Contrôleur ${name} est undefined ou mal exporté`);
  }
});

// Middleware de log compact global (toutes les requêtes sur /stats/*)
router.use((req, res, next) => {
  logger.debug(
    `[STATS ROUTES] ${req.method} ${req.originalUrl} | params=${JSON.stringify(
      req.params
    )} | query=${JSON.stringify(req.query)} | body=${JSON.stringify(req.body)}`
  );
  next();
});

// ----------- ROUTES -----------

// GET STATS (events, offers, tickets)
router.get(
  '/',
  authenticate,
  (req, res, next) => {
    if (!req.user || req.user.role !== 'ADMIN') {
      logger.warn('[STATS ROUTES][GET /] Accès refusé : non ADMIN');
      return res.status(403).json({ error: 'FORBIDDEN' });
    }
    logger.info('[STATS ROUTES][GET /] → getStatsController');
    next();
  },
  getStatsController
);

module.exports = router;
