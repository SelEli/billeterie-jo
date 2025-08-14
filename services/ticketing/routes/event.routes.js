const express = require('express');
const router = express.Router();

const authenticate = require('../middlewares/auth.middleware');
const validateRequest = require('../middlewares/validateRequest.middleware');
const logger = require('../utils/logger');

const { EventCreateSchema, EventUpdateSchema } = require('../validators/event.validator');

const {
  createEventController,
  readEventController,
  updateEventController,
  deleteEventController,
  listEventsController
} = require('../controllers/event');

// Vérification stricte des contrôleurs
[
  ['createEventController', createEventController],
  ['readEventController', readEventController],
  ['updateEventController', updateEventController],
  ['deleteEventController', deleteEventController],
  ['listEventsController', listEventsController]
].forEach(([name, fn]) => {
  if (typeof fn !== 'function') {
    throw new Error(`❌ Contrôleur ${name} est undefined ou mal exporté`);
  }
});

// Middleware de debug centralisé
router.use((req, res, next) => {
  logger.debug(`[EVENT ROUTES] ${req.method} ${req.originalUrl}`);
  next();
});

// ----------- ROUTES -----------

router.post(
  '/',
  authenticate,
  validateRequest(EventCreateSchema),
  (req, res, next) => {
    logger.info('[EVENT ROUTES] POST / => createEventController');
    next();
  },
  createEventController
);

router.get(
  '/:id',
  authenticate,
  (req, res, next) => {
    logger.info('[EVENT ROUTES] GET /:id => readEventController');
    next();
  },
  readEventController
);

router.put(
  '/:id',
  authenticate,
  validateRequest(EventUpdateSchema),
  (req, res, next) => {
    logger.info('[EVENT ROUTES] PUT /:id => updateEventController');
    next();
  },
  updateEventController
);

router.delete(
  '/:id',
  authenticate,
  (req, res, next) => {
    logger.info('[EVENT ROUTES] DELETE /:id => deleteEventController');
    next();
  },
  deleteEventController
);

router.get(
  '/',
  authenticate,
  (req, res, next) => {
    logger.info('[EVENT ROUTES] GET / => listEventsController');
    next();
  },
  listEventsController
);

module.exports = router;
