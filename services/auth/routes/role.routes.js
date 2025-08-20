const express = require('express');
const router = express.Router();

const { authenticate, validateRequest } = require('../middlewares');
const {
  logger,
  requestId,
  formatLogContext,
  createAuditTrail
} = require('../utils');

const updateUserRoleSchema = require('../schemas/updateUserRoleSchema');
const { updateUserRoleController } = require('../controllers/role');

// Vérification stricte
[
  ['updateUserRoleController', updateUserRoleController]
].forEach(([name, fn]) => {
  if (typeof fn !== 'function') {
    logger.error(`❌ Contrôleur ${name} est undefined ou mal exporté`);
    throw new Error(`❌ Contrôleur ${name} est undefined ou mal exporté`);
  }
  logger.debug(`✅ Contrôleur ${name} chargé`);
});

// Middleware global
router.use(requestId);
router.use((req, res, next) => {
  logger.debug(`[ROLE ROUTES] ${formatLogContext(req)}`);
  next();
});

// Route mise à jour de rôle
router.put(
  '/:id/role',
  authenticate,
  validateRequest(updateUserRoleSchema),
  (req, res, next) => {
    logger.info('[ROLE][PUT /:id/role] → updateUserRoleController');
    createAuditTrail(req, 'user.role.update');
    next();
  },
  updateUserRoleController
);

module.exports = router;
