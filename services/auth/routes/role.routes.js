// routes/role.routes.js
const express = require('express');
const router = express.Router();

const { authenticate, validateRequest } = require('../middlewares');
const { logger, requestId, formatLogContext } = require('../utils');

const {
  createRoleSchema,
  getRoleSchema,
  listRolesSchema,
  updateRoleSchema,
  deleteRoleSchema
} = require('../schemas/role');

const {
  createRoleController,
  getRoleController,
  listRolesController,
  updateRoleController,
  deleteRoleController
} = require('../controllers/role');

// Vérification stricte des exports
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
    next();
  },
  createRoleController
);

// LIST
router.get(
  '/',
  authenticate,
  validateRequest(listRolesSchema, 'query'),
  (req, res, next) => {
    logger.info('[ROLE][GET /] → listRolesController');
    next();
  },
  listRolesController
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

// UPDATE — format attendu par les tests d’intégration
router.put(
  '/:id',
  authenticate,
  validateRequest(updateRoleSchema, 'body'),
  (req, res, next) => {
    logger.info('[ROLE][PUT /:id] → updateRoleController');
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
    next();
  },
  deleteRoleController
);

module.exports = router;
