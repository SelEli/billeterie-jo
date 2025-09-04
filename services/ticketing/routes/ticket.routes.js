const express = require('express');
const router = express.Router();

const authenticate = require('../middlewares/auth.middleware');
const validateRequest = require('../middlewares/validateRequest.middleware');
const logger = require('../utils/logger');

const {
  TicketCreateSchema,
  TicketUpdateSchema
} = require('../schemas/ticket.schema');

const { createTicketController }   = require('../controllers/ticket/createTicket.controller');
const { readTicketController }     = require('../controllers/ticket/readTicket.controller');
const { updateTicketController }   = require('../controllers/ticket/updateTicket.controller');
const { deleteTicketController }   = require('../controllers/ticket/deleteTicket.controller');
const { listTicketsController }    = require('../controllers/ticket/listTickets.controller');
const { validateTicketController } = require('../controllers/ticket/validateTicket.controller');
const { verifyTicketController }   = require('../controllers/ticket/verifyTicket.controller');

// Vérification stricte des contrôleurs
[
  ['createTicketController', createTicketController],
  ['readTicketController', readTicketController],
  ['updateTicketController', updateTicketController],
  ['deleteTicketController', deleteTicketController],
  ['listTicketsController', listTicketsController],
  ['validateTicketController', validateTicketController],
  ['verifyTicketController', verifyTicketController]
].forEach(([name, fn]) => {
  if (typeof fn !== 'function') {
    throw new Error(`❌ Contrôleur ${name} est undefined ou mal exporté`);
  }
});

// Middleware de log compact global
router.use((req, res, next) => {
  logger.debug(
    `[TICKET ROUTES] ${req.method} ${req.originalUrl} | params=${JSON.stringify(req.params)} | query=${JSON.stringify(req.query)} | body=${JSON.stringify(req.body)}`
  );
  next();
});

// ----------- ROUTES -----------

router.post(
  '/',
  authenticate,
  validateRequest(TicketCreateSchema),
  (req, res, next) => {
    logger.info('[TICKET ROUTES][POST /] → createTicketController');
    next();
  },
  createTicketController
);

router.get(
  '/:id',
  authenticate,
  (req, res, next) => {
    logger.info('[TICKET ROUTES][GET /:id] → readTicketController');
    next();
  },
  readTicketController
);

router.put(
  '/:id',
  authenticate,
  validateRequest(TicketUpdateSchema),
  (req, res, next) => {
    logger.info('[TICKET ROUTES][PUT /:id] → updateTicketController');
    next();
  },
  updateTicketController
);

router.delete(
  '/:id',
  authenticate,
  (req, res, next) => {
    logger.info('[TICKET ROUTES][DELETE /:id] → deleteTicketController');
    next();
  },
  deleteTicketController
);

router.get(
  '/',
  authenticate,
  (req, res, next) => {
    logger.info('[TICKET ROUTES][GET /] → listTicketsController');
    next();
  },
  listTicketsController
);

// ✅ Endpoint pour validation par Payment
//    - Auth obligatoire
//    - Rôle PAYMENT vérifié dans le contrôleur
//    - Appelle validateTicketController qui met à jour la DB et émet Kafka
router.post(
  '/validate',
  authenticate,
  (req, res, next) => {
    logger.info('[TICKET ROUTES][POST /validate] → validateTicketController (via Payment)');
    next();
  },
  validateTicketController
);

// ✅ Endpoint pour vérification sur site (AGENT / EMPLOYEE)
//    - Auth obligatoire
//    - Rôle vérifié dans le contrôleur
//    - Appelle verifyTicketController qui met à jour le statut (USED) et émet Kafka
router.post(
  '/verify',
  authenticate,
  (req, res, next) => {
    logger.info('[TICKET ROUTES][POST /verify] → verifyTicketController (contrôle sur site)');
    next();
  },
  verifyTicketController
);

module.exports = router;
