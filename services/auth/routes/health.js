const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

// Vérification stricte du contrôleur inline
const healthController = (req, res) => {
  logger.info('[HEALTH] 💓 OK');
  res.status(200).json({
    status: 'success',
    data: { message: 'OK' },
    errors: [],
    meta: {}
  });
};
if (typeof healthController !== 'function') {
  logger.error('❌ Contrôleur healthController est undefined ou mal exporté');
  throw new Error('❌ Contrôleur healthController est undefined ou mal exporté');
}
logger.debug('✅ Contrôleur healthController chargé');

// Middleware debug
router.use((req, res, next) => {
  logger.debug(`[HEALTH ROUTES] ${req.method} ${req.originalUrl}`);
  next();
});

// Unique route
router.get('/', healthController);

module.exports = router;
