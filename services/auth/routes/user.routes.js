const express = require('express');
const router = express.Router();

const { authenticate, validateRequest } = require('../middlewares');
const {
  logger,
  requestId,
  formatLogContext,
  createAuditTrail
} = require('../utils');

const createUserSchema = require('../schemas/createUserSchema');
const updateUserSchema = require('../schemas/updateUserSchema');

const {
  createUserController,
  readUserController,
  updateUserController,
  deleteUserController
} = require('../controllers/user');

const { updateUserRoleController } = require('../controllers/role');

// Vérification stricte
[
  ['createUserController', createUserController],
  ['readUserController', readUserController],
  ['updateUserController', updateUserController],
  ['deleteUserController', deleteUserController],
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
  logger.debug(`[USER ROUTES] ${formatLogContext(req)}`);
  next();
});

// Routes CRUD
router.post(
  '/',
  authenticate,
  validateRequest(createUserSchema),
  (req, res, next) => {
    logger.info('[USER][POST /] → createUserController');
    createAuditTrail(req, 'user.create');
    next();
  },
  createUserController
);

router.get(
  '/:id',
  authenticate,
  (req, res, next) => {
    logger.info('[USER][GET /:id] → readUserController');
    next();
  },
  readUserController
);

router.put(
  '/:id',
  authenticate,
  validateRequest(updateUserSchema),
  (req, res, next) => {
    logger.info('[USER][PUT /:id] → updateUserController');
    createAuditTrail(req, 'user.update');
    next();
  },
  updateUserController
);

router.delete(
  '/:id',
  authenticate,
  (req, res, next) => {
    logger.info('[USER][DELETE /:id] → deleteUserController');
    createAuditTrail(req, 'user.delete');
    next();
  },
  deleteUserController
);

// Gestion du rôle
router.put(
  '/:id/role',
  authenticate,
  (req, res, next) => {
    logger.info('[USER][PUT /:id/role] → updateUserRoleController');
    createAuditTrail(req, 'user.role.update');
    next();
  },
  updateUserRoleController
);

module.exports = router;
