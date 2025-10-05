const express = require('express');
const router = express.Router();

const { authenticate, validateRequest } = require('../middlewares');
const { logger, requestId, formatLogContext } = require('../utils');

// ✅ Schémas depuis index schemas/user
const {
  createUserSchema,
  readUserSchema,
  listUsersSchema,
  updateUserSchema,
  deleteUserSchema
} = require('../schemas/user');

// ✅ Contrôleurs depuis index controllers/user
const {
  createUserController,
  readUserController,
  listUsersController,
  updateUserController,
  deleteUserController
} = require('../controllers/user.controller');

// Vérification stricte des exports
[
  ['createUserController', createUserController],
  ['readUserController', readUserController],
  ['listUsersController', listUsersController],
  ['updateUserController', updateUserController],
  ['deleteUserController', deleteUserController]
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
    next();
  },
  deleteUserController
);

module.exports = router;
