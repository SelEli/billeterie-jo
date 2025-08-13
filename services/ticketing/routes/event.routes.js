const express = require('express');
const router = express.Router();

const authenticate = require('../middlewares/auth.middleware');
const validateRequest = require('../middlewares/validateRequest.middleware');

const { EventCreateSchema, EventUpdateSchema } = require('../schemas/event.schema');

const {
  createEventController,
  readEventController,
  updateEventController,
  deleteEventController,
  listEventsController
} = require('../controllers/event');

// Vérification imports stricts
if (
  typeof createEventController !== 'function' ||
  typeof readEventController !== 'function' ||
  typeof updateEventController !== 'function' ||
  typeof deleteEventController !== 'function' ||
  typeof listEventsController !== 'function'
) {
  throw new Error('❌ Un ou plusieurs contrôleurs Event sont undefined ou mal exportés');
}

// Debug global
router.use((req, res, next) => {
  console.log(`🔹 [ROUTES DEBUG][EVENT] ${req.method} ${req.originalUrl} reçu`);
  console.log('🔹 Headers:', req.headers);
  console.log('🔹 Body brut:', req.body);
  next();
});

function debugAuth(req, res, next) {
  console.log(`🔹 [ROUTES DEBUG][EVENT] Appel authenticate pour ${req.method} ${req.originalUrl}`);
  next();
}
function debugValidate(schemaName) {
  return (req, res, next) => {
    console.log(`🔹 [ROUTES DEBUG][EVENT] Validation ${schemaName} avant controller`);
    next();
  };
}

// ----------- ROUTES -----------
router.post(
  '/',
  debugAuth,
  authenticate,
  debugValidate('EventCreateSchema'),
  validateRequest(EventCreateSchema),
  (req, res, next) => {
    console.log('🔹 [ROUTES DEBUG][EVENT] POST / => avant createEventController', {
      user: req.user,
      validated: req.validated,
    });
    next();
  },
  createEventController
);

router.get(
  '/:id',
  debugAuth,
  authenticate,
  (req, res, next) => {
    console.log('🔹 [ROUTES DEBUG][EVENT] GET /:id => avant readEventController', {
      params: req.params,
      user: req.user,
    });
    next();
  },
  readEventController
);

router.put(
  '/:id',
  debugAuth,
  authenticate,
  debugValidate('EventUpdateSchema'),
  validateRequest(EventUpdateSchema),
  (req, res, next) => {
    console.log('🔹 [ROUTES DEBUG][EVENT] PUT /:id => avant updateEventController', {
      params: req.params,
      user: req.user,
      validated: req.validated,
    });
    next();
  },
  updateEventController
);

router.delete(
  '/:id',
  debugAuth,
  authenticate,
  (req, res, next) => {
    console.log('🔹 [ROUTES DEBUG][EVENT] DELETE /:id => avant deleteEventController', {
      params: req.params,
      user: req.user,
    });
    next();
  },
  deleteEventController
);

router.get(
  '/',
  debugAuth,
  authenticate,
  (req, res, next) => {
    console.log('🔹 [ROUTES DEBUG][EVENT] GET / => avant listEventsController', { user: req.user });
    next();
  },
  listEventsController
);

module.exports = router;
