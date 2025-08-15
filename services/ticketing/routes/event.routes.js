// routes/event.js
const express = require('express');
const router = express.Router();

const authenticate = require('../middlewares/auth.middleware');
const validateRequest = require('../middlewares/validateRequest.middleware');
const logger = require('../utils/logger');

// ⚠️ Import cohérent avec validators/event.validator.js
const {
  createEventSchema,
  updateEventSchema
} = require('../validators/event.validator');

// ⚠️ Imports destructurés des exports nommés dans controllers/event/index.js
const {
  createEventController,
  readEventController,
  updateEventController,
  deleteEventController,
  listEventsController
} = require('../controllers/event');

// Vérification stricte des contrôleurs au chargement
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

// Middleware de debug compact : trace chaque requête avec ses données clés
router.use((req, res, next) => {
  logger.debug(
    `[EVENT ROUTES] ${req.method} ${req.originalUrl} | params=${JSON.stringify(req.params)} | query=${JSON.stringify(req.query)} | body=${JSON.stringify(req.body)}`
  );
  next();
});

// ----------- ROUTES -----------

// Création d’événement
router.post(
  '/',
  authenticate,
  validateRequest(createEventSchema),
  (req, res, next) => {
    logger.info('[EVENT ROUTES][POST /] → createEventController');
    next();
  },
  createEventController
);

// Lecture d’un événement par ID
router.get(
  '/:id',
  authenticate,
  (req, res, next) => {
    logger.info('[EVENT ROUTES][GET /:id] → readEventController');
    next();
  },
  readEventController
);

// Mise à jour d’un événement
router.put(
  '/:id',
  authenticate,
  validateRequest(updateEventSchema),
  (req, res, next) => {
    logger.info('[EVENT ROUTES][PUT /:id] → updateEventController');
    next();
  },
  updateEventController
);

// Suppression d’un événement
router.delete(
  '/:id',
  authenticate,
  (req, res, next) => {
    logger.info('[EVENT ROUTES][DELETE /:id] → deleteEventController');
    next();
  },
  deleteEventController
);

// Liste des événements (avec filtres)
router.get(
  '/',
  authenticate,
  (req, res, next) => {
    logger.info('[EVENT ROUTES][GET /] → listEventsController');
    next();
  },
  listEventsController
);

module.exports = router;
