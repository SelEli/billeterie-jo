const express = require('express');
const router = express.Router();

const { authenticate, validateRequest } = require('../middlewares');
const { logger, requestId, formatLogContext } = require('../utils');

// ✅ Schémas depuis schemas/user
const {
  createUserSchema,
  readUserSchema,
  listUsersSchema,
  updateUserSchema,
  deleteUserSchema
} = require('../schemas/user.schema');

// ✅ Contrôleurs depuis controllers/user
const {
  createUserController,
  readUserController,
  listUsersController,
  updateUserController,
  deleteUserController
} = require('../controllers/user.controller');

// Vérification stricte + log unique
const controllers = {
  createUserController,
  readUserController,
  listUsersController,
  updateUserController,
  deleteUserController
};

const invalid = Object.entries(controllers).filter(([name, fn]) => typeof fn !== 'function');
if (invalid.length > 0) {
  invalid.forEach(([name]) => logger.error(`❌ Contrôleur ${name} est undefined ou mal exporté`));
  throw new Error(`❌ ${invalid.length} contrôleur(s) USER invalides détectés`);
}
logger.info(`✅ Contrôleurs USER chargés : ${Object.keys(controllers).join(', ')}`);

// Middleware global
router.use(requestId);
router.use((req, res, next) => {
  logger.debug(`[USER ROUTES] ${formatLogContext(req)}`);
  next();
});

// CREATE
router.post('/', authenticate, validateRequest(createUserSchema, 'body'), createUserController);

// LIST
router.get('/', authenticate, validateRequest(listUsersSchema, 'query'), listUsersController);

// READ ONE
router.get('/:id', authenticate, validateRequest(readUserSchema, 'params'), readUserController);

// UPDATE
router.put('/:id', authenticate, validateRequest(updateUserSchema, 'body'), updateUserController);

// DELETE
router.delete('/:id', authenticate, validateRequest(deleteUserSchema, 'params'), deleteUserController);

module.exports = router;
