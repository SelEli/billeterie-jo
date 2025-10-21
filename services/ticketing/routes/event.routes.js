// routes/event.js
const express = require('express');
const router = express.Router();

const authenticate = require('../middlewares/auth.middleware');
const validateRequest = require('../middlewares/validateRequest.middleware');
const logger = require('../utils/logger');

// ⚠️ Import cohérent avec schemas/event.schema.js
const {
  createEventSchema,
  updateEventSchema
} = require('../schemas/event.schema');

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
    `[EVENT ROUTES] ${req.method} ${req.originalUrl} | params=${JSON.stringify(
      req.params
    )} | query=${JSON.stringify(req.query)} | body=${JSON.stringify(req.body)}`
  );
  next();
});

// ----------- ROUTES -----------

// Création d’événement (protégé)
router.post('/', authenticate, validateRequest(createEventSchema), createEventController);

// Lecture d’un événement par ID (public)
router.get('/:id', readEventController);

// Mise à jour d’un événement (protégé)
router.put('/:id', authenticate, validateRequest(updateEventSchema), updateEventController);

// Suppression d’un événement (protégé)
router.delete('/:id', authenticate, deleteEventController);

// Liste des événements (public)
router.get('/', listEventsController);

module.exports = router;
