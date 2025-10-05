const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const roleRoutes = require('./role.routes');
const healthRoutes = require('./health');

// Vérification stricte des routeurs au chargement
const routers = {
  '/auth': authRoutes,
  '/user': userRoutes,
  '/role': roleRoutes,
  '/health': healthRoutes
};

const invalid = Object.entries(routers).filter(
  ([, r]) => typeof r !== 'function' && typeof r.use !== 'function'
);

if (invalid.length > 0) {
  invalid.forEach(([name]) => {
    logger.error(`❌ Routeur ${name} est undefined ou mal exporté`);
  });
  throw new Error(`❌ ${invalid.length} routeur(s) invalides détectés`);
}

// Logger enrichi par requête
router.use((req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.ip;
  const ua = req.headers['user-agent'] || 'unknown';
  const reqId = req.id || '-';
  logger.debug(
    `[MAIN ROUTER] ${req.method} ${req.originalUrl} | IP=${ip} | UA="${ua}" | reqId=${reqId}`
  );
  next();
});

// Montage des sous-routeurs
Object.entries(routers).forEach(([path, r]) => {
  router.use(path, r);
});

// 🔒 Log de sécurité unique
logger.info(
  `✅ Routeurs montés (${Object.keys(routers).length}) : ${Object.keys(routers).join(', ')}`
);

module.exports = router;
