const express = require('express');
const router = express.Router();

const { authenticate, validateRequest } = require('../middlewares');
const { logger, requestId, formatLogContext } = require('../utils');

// ✅ Schémas depuis schemas/auth
const {
  registerUserSchema,
  updateProfileSchema,
  loginSchema,
  logoutSchema
} = require('../schemas/auth.schema');

// ✅ Contrôleurs depuis controllers/auth
const {
  registerUserController,
  loginController,
  getProfileController,
  updateProfileController,
  deleteProfileController,
  logoutController
} = require('../controllers/auth.controller');

// Vérification stricte + log unique
const controllers = {
  registerUserController,
  loginController,
  getProfileController,
  updateProfileController,
  deleteProfileController,
  logoutController
};

const invalid = Object.entries(controllers).filter(([name, fn]) => typeof fn !== 'function');
if (invalid.length > 0) {
  invalid.forEach(([name]) => logger.error(`❌ Contrôleur ${name} est undefined ou mal exporté`));
  throw new Error(`❌ ${invalid.length} contrôleur(s) AUTH invalides détectés`);
}
logger.info(`✅ Contrôleurs AUTH chargés : ${Object.keys(controllers).join(', ')}`);

// Middleware global
router.use(requestId);
router.use((req, res, next) => {
  logger.debug(`[AUTH ROUTES] ${formatLogContext(req)}`);
  next();
});

// REGISTER
router.post('/register', validateRequest(registerUserSchema, 'body'), registerUserController);

// LOGIN
router.post('/login', validateRequest(loginSchema, 'body'), loginController);

// LOGOUT
router.post('/logout', authenticate, validateRequest(logoutSchema, 'body'), logoutController);

// GET PROFILE
router.get('/profile', authenticate, getProfileController);

// UPDATE PROFILE
router.put('/profile', authenticate, validateRequest(updateProfileSchema, 'body'), updateProfileController);

// DELETE PROFILE
router.delete('/profile', authenticate, deleteProfileController);

module.exports = router;
