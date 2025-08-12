// routes/ticket.routes.js
const express = require('express');
const router = express.Router();

const authenticate = require('../middlewares/auth.middleware');
const validateRequest = require('../middlewares/validateRequest.middleware');

const {
  TicketCreateSchema,
  TicketUpdateSchema
} = require('../schemas/ticket.schema');

// Import des controllers
const { createTicketController } = require('../controllers/ticket/createTicket.controller');
const { readTicketController } = require('../controllers/ticket/readTicket.controller');
const { updateTicketController } = require('../controllers/ticket/updateTicket.controller');
const { deleteTicketController } = require('../controllers/ticket/deleteTicket.controller');
const { listTicketsController } = require('../controllers/ticket/listTickets.controller');

// Vérification imports stricts
if (
  typeof createTicketController !== 'function' ||
  typeof readTicketController !== 'function' ||
  typeof updateTicketController !== 'function' ||
  typeof deleteTicketController !== 'function' ||
  typeof listTicketsController !== 'function'
) {
  throw new Error('❌ Un ou plusieurs contrôleurs sont undefined ou mal exportés');
}

// Middleware debug global pour toutes les routes de ce router
router.use((req, res, next) => {
  console.log(`🔹 [ROUTES DEBUG] ${req.method} ${req.originalUrl} reçu`);
  console.log('🔹 Headers:', req.headers);
  console.log('🔹 Body brut:', req.body);
  next();
});

// Middleware pour tracer `authenticate`
function debugAuth(req, res, next) {
  console.log(`🔹 [ROUTES DEBUG] Appel authenticate pour ${req.method} ${req.originalUrl}`);
  next();
}

// Middleware pour tracer `validateRequest`
function debugValidate(schemaName) {
  return (req, res, next) => {
    console.log(`🔹 [ROUTES DEBUG] Validation ${schemaName} avant controller`);
    next();
  };
}

// ----------- ROUTES -----------

router.post(
  '/',
  debugAuth,
  authenticate,
  debugValidate('TicketCreateSchema'),
  validateRequest(TicketCreateSchema),
  (req, res, next) => {
    console.log('🔹 [ROUTES DEBUG] POST / => avant createTicketController', {
      user: req.user,
      validated: req.validated,
    });
    next();
  },
  createTicketController
);

router.get(
  '/:id',
  debugAuth,
  authenticate,
  (req, res, next) => {
    console.log('🔹 [ROUTES DEBUG] GET /:id => avant readTicketController', {
      params: req.params,
      user: req.user,
    });
    next();
  },
  readTicketController
);

router.put(
  '/:id',
  debugAuth,
  authenticate,
  debugValidate('TicketUpdateSchema'),
  validateRequest(TicketUpdateSchema),
  (req, res, next) => {
    console.log('🔹 [ROUTES DEBUG] PUT /:id => avant updateTicketController', {
      params: req.params,
      user: req.user,
      validated: req.validated,
    });
    next();
  },
  updateTicketController
);

router.delete(
  '/:id',
  debugAuth,
  authenticate,
  (req, res, next) => {
    console.log('🔹 [ROUTES DEBUG] DELETE /:id => avant deleteTicketController', {
      params: req.params,
      user: req.user,
    });
    next();
  },
  deleteTicketController
);

router.get(
  '/',
  debugAuth,
  authenticate,
  (req, res, next) => {
    console.log('🔹 [ROUTES DEBUG] GET / => avant listTicketsController', { user: req.user });
    next();
  },
  listTicketsController
);

module.exports = router;
