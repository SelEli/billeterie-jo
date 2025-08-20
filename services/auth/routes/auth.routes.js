// routes/auth.routes.js
const express = require('express');
const router = express.Router();

const { authenticate, validateRequest } = require('../middlewares'); // via index middlewares
const { logger } = require('../utils');

// Schémas
const registerUserSchema = require('../schemas/registerUserSchema');
const updateProfileSchema = require('../schemas/updateProfileSchema');

// Import groupé via index controllers/auth
const {
  registerUserController,
  loginUserController,
  getProfileController,
  updateProfileController,
  deleteProfileController
} = require('../controllers/auth');

// Vérification stricte
[
  ['registerUserController', registerUserController],
  ['loginUserController', loginUserController],
  ['getProfileController', getProfileController],
  ['updateProfileController', updateProfileController],
  ['deleteProfileController', deleteProfileController]
].forEach(([name, fn]) => {
  if (typeof fn !== 'function') {
    logger.error(`❌ Contrôleur ${name} est undefined ou mal exporté`);
    throw new Error(`❌ Contrôleur ${name} est undefined ou mal exporté`);
  }
  logger.debug(`✅ Contrôleur ${name} chargé`);
});

// Middleware debug global aux routes Auth
router.use((req, res, next) => {
  logger.debug(
    `[AUTH ROUTES] ${req.method} ${req.originalUrl} | params=${JSON.stringify(req.params)} | body=${JSON.stringify(req.body)}`
  );
  next();
});

// Routes
router.post(
  '/register',
  validateRequest(registerUserSchema),
  (req, res, next) => {
    logger.info('[AUTH][POST /register] → registerUserController');
    next();
  },
  registerUserController
);

router.post(
  '/login',
  (req, res, next) => {
    logger.info('[AUTH][POST /login] → loginUserController');
    next();
  },
  loginUserController
);

router.get(
  '/profile',
  authenticate,
  (req, res, next) => {
    logger.info('[AUTH][GET /profile] → getProfileController');
    next();
  },
  getProfileController
);

router.put(
  '/profile',
  authenticate,
  validateRequest(updateProfileSchema),
  (req, res, next) => {
    logger.info('[AUTH][PUT /profile] → updateProfileController');
    next();
  },
  updateProfileController
);

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
