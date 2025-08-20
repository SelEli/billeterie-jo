const express = require('express');
const router = express.Router();

const { authenticate, validateRequest } = require('../middlewares');
const {
  logger,
  requestId,
  formatLogContext,
  createAuditTrail
} = require('../utils');

// ✅ Import complet depuis l'index schemas/role
const {
  createRoleSchema,
  getRoleSchema,
  listRolesSchema,   // ← pluriel
  updateRoleSchema,
  deleteRoleSchema
} = require('../schemas/role');

const {
  createRoleController,
  getRoleController,
  listRolesController, // ← pluriel
  updateRoleController,
  deleteRoleController
} = require('../controllers/role');

// Vérification stricte des contrôleurs
[
  ['createRoleController', createRoleController],
  ['getRoleController', getRoleController],
  ['listRolesController', listRolesController],
  ['updateRoleController', updateRoleController],
  ['deleteRoleController', deleteRoleController]
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

// CREATE
router.post(
  '/',
  authenticate,
  validateRequest(createRoleSchema, 'body'),
  (req, res, next) => {
    logger.info('[ROLE][POST /] → createRoleController');
    createAuditTrail(req, 'role.create');
    next();
  },
  createRoleController
);

// LIST
router.get(
  '/',
  authenticate,
  validateRequest(listRolesSchema, 'query'), // ← pluriel
  (req, res, next) => {
    logger.info('[ROLE][GET /] → listRolesController'); // ← pluriel
    next();
  },
  listRolesController // ← pluriel
);

// GET ONE
router.get(
  '/:id',
  authenticate,
  validateRequest(getRoleSchema, 'params'),
  (req, res, next) => {
    logger.info('[ROLE][GET /:id] → getRoleController');
    next();
  },
  getRoleController
);

// UPDATE
router.put(
  '/:id/role',
  authenticate,
  validateRequest(updateRoleSchema, 'body'),
  (req, res, next) => {
    logger.info('[ROLE][PUT /:id/role] → updateRoleController');
    createAuditTrail(req, 'user.role.update');
    next();
  },
  updateRoleController
);

// DELETE
router.delete(
  '/:id',
  authenticate,
  validateRequest(deleteRoleSchema, 'params'),
  (req, res, next) => {
    logger.info('[ROLE][DELETE /:id] → deleteRoleController');
    createAuditTrail(req, 'role.delete');
    next();
  },
  deleteRoleController
);

module.exports = router;
