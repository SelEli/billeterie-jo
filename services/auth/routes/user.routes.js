// routes/user.routes.js
const express = require('express');
const router = express.Router();

const { authenticate, validateRequest } = require('../middlewares');
const {
  logger,
  requestId,
  formatLogContext,
  createAuditTrail
} = require('../utils');

// ✅ Tous les schémas User depuis l'index
const {
  createUserSchema,
  readUserSchema,
  listUsersSchema,
  updateUserSchema,
  deleteUserSchema
} = require('../schemas/user');

// ✅ Tous les contrôleurs User depuis l'index
const {
  createUserController,
  readUserController,
  listUsersController,
  updateUserController,
  deleteUserController
} = require('../controllers/user');

// ✅ Contrôleur rôle (pour mise à jour de rôle utilisateur)
const { updateRoleController } = require('../controllers/role');

// Vérification stricte
[
  ['createUserController', createUserController],
  ['readUserController', readUserController],
  ['listUsersController', listUsersController],
  ['updateUserController', updateUserController],
  ['deleteUserController', deleteUserController],
  ['updateRoleController', updateRoleController]
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
  logger.debug(`[USER ROUTES] ${formatLogContext(req)}`);
  next();
});

// CREATE
router.post(
  '/',
  authenticate,
  validateRequest(createUserSchema, 'body'),
  (req, res, next) => {
    logger.info('[USER][POST /] → createUserController');
    createAuditTrail(req, 'user.create');
    next();
  },
  createUserController
);

// LIST
router.get(
  '/',
  authenticate,
  validateRequest(listUsersSchema, 'query'),
  (req, res, next) => {
    logger.info('[USER][GET /] → listUsersController');
    next();
  },
  listUsersController
);

// READ ONE
router.get(
  '/:id',
  authenticate,
  validateRequest(readUserSchema, 'params'),
  (req, res, next) => {
    logger.info('[USER][GET /:id] → readUserController');
    next();
  },
  readUserController
);

// UPDATE
router.put(
  '/:id',
  authenticate,
  validateRequest(updateUserSchema, 'body'),
  (req, res, next) => {
    logger.info('[USER][PUT /:id] → updateUserController');
    createAuditTrail(req, 'user.update');
    next();
  },
  updateUserController
);

// DELETE
router.delete(
  '/:id',
  authenticate,
  validateRequest(deleteUserSchema, 'params'),
  (req, res, next) => {
    logger.info('[USER][DELETE /:id] → deleteUserController');
    createAuditTrail(req, 'user.delete');
    next();
  },
  deleteUserController
);

// UPDATE ROLE
router.put(
  '/:id/role',
  authenticate,
  (req, res, next) => {
    logger.info('[USER][PUT /:id/role] → updateRoleController');
    createAuditTrail(req, 'user.role.update');
    next();
  },
  updateRoleController
);

module.exports = router;
