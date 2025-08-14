const express = require('express');
const router = express.Router();

const authenticate = require('../middlewares/auth.middleware');
const validateRequest = require('../middlewares/validateRequest.middleware');
const logger = require('../utils/logger');

const {
  TicketCreateSchema,
  TicketUpdateSchema
} = require('../schemas/ticket.schema');

const { createTicketController } = require('../controllers/ticket/createTicket.controller');
const { readTicketController } = require('../controllers/ticket/readTicket.controller');
const { updateTicketController } = require('../controllers/ticket/updateTicket.controller');
const { deleteTicketController } = require('../controllers/ticket/deleteTicket.controller');
const { listTicketsController } = require('../controllers/ticket/listTickets.controller');

// Vérification stricte des contrôleurs
[
  ['createTicketController', createTicketController],
  ['readTicketController', readTicketController],
  ['updateTicketController', updateTicketController],
  ['deleteTicketController', deleteTicketController],
  ['listTicketsController', listTicketsController]
].forEach(([name, fn]) => {
  if (typeof fn !== 'function') {
    throw new Error(`❌ Contrôleur ${name} est undefined ou mal exporté`);
  }
});

// Middleware de debug centralisé
router.use((req, res, next) => {
  logger.debug(`[TICKET ROUTES] ${req.method} ${req.originalUrl}`);
  next();
});

// ----------- ROUTES -----------

router.post(
  '/',
  authenticate,
  validateRequest(TicketCreateSchema),
  (req, res, next) => {
    logger.info('[TICKET ROUTES] POST / => createTicketController');
    next();
  },
  createTicketController
);

router.get(
  '/:id',
  authenticate,
  (req, res, next) => {
    logger.info('[TICKET ROUTES] GET /:id => readTicketController');
    next();
  },
  readTicketController
);

router.put(
  '/:id',
  authenticate,
  validateRequest(TicketUpdateSchema),
  (req, res, next) => {
    logger.info('[TICKET ROUTES] PUT /:id => updateTicketController');
    next();
  },
  updateTicketController
);

router.delete(
  '/:id',
  authenticate,
  (req, res, next) => {
    logger.info('[TICKET ROUTES] DELETE /:id => deleteTicketController');
    next();
  },
  deleteTicketController
);

router.get(
  '/',
  authenticate,
  (req, res, next) => {
    logger.info('[TICKET ROUTES] GET / => listTicketsController');
    next();
  },
  listTicketsController
);

module.exports = router;
