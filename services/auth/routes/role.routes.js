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
} = require('../schemas/role.schema');

const {
  createRoleController,
  getRoleController,
  listRolesController,
  updateRoleController,
  deleteRoleController
} = require('../controllers/role.controller');

// Vérification stricte + log unique
const controllers = {
  createRoleController,
  getRoleController,
  listRolesController,
  updateRoleController,
  deleteRoleController
};

const invalid = Object.entries(controllers).filter(([name, fn]) => typeof fn !== 'function');
if (invalid.length > 0) {
  invalid.forEach(([name]) => logger.error(`❌ Contrôleur ${name} est undefined ou mal exporté`));
  throw new Error(`❌ ${invalid.length} contrôleur(s) ROLE invalides détectés`);
}
logger.info(`✅ Contrôleurs ROLE chargés : ${Object.keys(controllers).join(', ')}`);

// Middleware global
router.use(requestId);
router.use((req, res, next) => {
  logger.debug(`[ROLE ROUTES] ${formatLogContext(req)}`);
  next();
});

// CREATE
router.post('/', authenticate, validateRequest(createRoleSchema, 'body'), createRoleController);

// LIST
router.get('/', authenticate, validateRequest(listRolesSchema, 'query'), listRolesController);

// GET ONE
router.get('/:id', authenticate, validateRequest(getRoleSchema, 'params'), getRoleController);

// UPDATE
router.put('/:id', authenticate, validateRequest(updateRoleSchema, 'body'), updateRoleController);

// DELETE
router.delete('/:id', authenticate, validateRequest(deleteRoleSchema, 'params'), deleteRoleController);

module.exports = router;
