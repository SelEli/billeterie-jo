// routes/auth.routes.js
const express = require('express');
const router = express.Router();

const { authenticate, validateRequest } = require('../middlewares');
const { logger, requestId, formatLogContext } = require('../utils');

// ✅ Schémas depuis index schemas/auth
const {
  registerUserSchema,
  updateProfileSchema,
  loginSchema,
  logoutSchema
} = require('../schemas/auth');

// ✅ Contrôleurs depuis index controllers/auth (désormais unique)
const {
  registerUserController,
  loginController,
  getProfileController,
  updateProfileController,
  deleteProfileController,
  logoutController
} = require('../controllers/auth.controller');

// Vérification stricte
[
  ['registerUserController', registerUserController],
  ['loginController', loginController],
  ['getProfileController', getProfileController],
  ['updateProfileController', updateProfileController],
  ['deleteProfileController', deleteProfileController],
  ['logoutController', logoutController]
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
  logger.debug(`[AUTH ROUTES] ${formatLogContext(req)}`);
  next();
});

// REGISTER
router.post(
  '/register',
  validateRequest(registerUserSchema, 'body'),
  (req, res, next) => {
    logger.info('[AUTH][POST /register] → registerUserController');
    next();
  },
  registerUserController
);

// LOGIN
router.post(
  '/login',
  validateRequest(loginSchema, 'body'),
  (req, res, next) => {
    logger.info('[AUTH][POST /login] → loginController');
    next();
  },
  loginController
);

// LOGOUT
router.post(
  '/logout',
  authenticate,
  validateRequest(logoutSchema, 'body'),
  (req, res, next) => {
    logger.info('[AUTH][POST /logout] → logoutController');
    next();
  },
  logoutController
);

// GET PROFILE
router.get(
  '/profile',
  authenticate,
  (req, res, next) => {
    logger.info('[AUTH][GET /profile] → getProfileController');
    next();
  },
  getProfileController
);

// UPDATE PROFILE
router.put(
  '/profile',
  authenticate,
  validateRequest(updateProfileSchema, 'body'),
  (req, res, next) => {
    logger.info('[AUTH][PUT /profile] → updateProfileController');
    next();
  },
  updateProfileController
);

// DELETE PROFILE
router.delete(
  '/profile',
  authenticate,
  (req, res, next) => {
    logger.info('[AUTH][DELETE /profile] → deleteProfileController');
    next();
  },
  deleteProfileController
);

module.exports = router;
