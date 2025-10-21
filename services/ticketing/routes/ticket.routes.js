/**
 * Ticket Routes
 * -------------
 * Ce fichier définit toutes les routes REST liées aux tickets :
 *   - CRUD (create, read, update, delete, list)
 *   - Validation (via Payment)
 *   - Vérification sur site (Agent / Employee / Admin)
 *
 * Points clés :
 *   - Auth obligatoire sur toutes les routes
 *   - Validation des schémas avec Zod (createTicketSchema, updateTicketSchema, validateTicketSchema)
 *   - Logs détaillés pour chaque appel
 *   - Vérification stricte des contrôleurs importés
 */

const express = require('express');
const router = express.Router();

const authenticate = require('../middlewares/auth.middleware');
const validateRequest = require('../middlewares/validateRequest.middleware');
const logger = require('../utils/logger');

const {
  createTicketSchema,
  updateTicketSchema,
  validateTicketSchema
} = require('../schemas/ticket.schema');

const { createTicketController }   = require('../controllers/ticket/createTicket.controller');
const { readTicketController }     = require('../controllers/ticket/readTicket.controller');
const { updateTicketController }   = require('../controllers/ticket/updateTicket.controller');
const { deleteTicketController }   = require('../controllers/ticket/deleteTicket.controller');
const { listTicketsController }    = require('../controllers/ticket/listTickets.controller');
const { validateTicketController } = require('../controllers/ticket/validateTicket.controller');
const { verifyTicketController }   = require('../controllers/ticket/verifyTicket.controller');

// Vérification stricte des contrôleurs importés
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

// Middleware de log compact global (toutes les requêtes sur /ticket/*)
router.use((req, res, next) => {
  logger.debug(
    `[TICKET ROUTES] ${req.method} ${req.originalUrl} | params=${JSON.stringify(req.params)} | query=${JSON.stringify(req.query)} | body=${JSON.stringify(req.body)}`
  );
  next();
});

// ----------- ROUTES -----------

// CREATE
router.post(
  '/',
  authenticate,
  validateRequest(createTicketSchema),
  (req, res, next) => {
    logger.info('[TICKET ROUTES][POST /] → createTicketController');
    next();
  },
  createTicketController
);

// READ ONE (⚠️ regex numérique pour éviter conflit avec /verify, /validate, etc.)
router.get(
  '/:id(\\d+)',
  authenticate,
  (req, res, next) => {
    logger.info('[TICKET ROUTES][GET /:id] → readTicketController');
    next();
  },
  readTicketController
);

// UPDATE
router.put(
  '/:id(\\d+)',
  authenticate,
  validateRequest(updateTicketSchema),
  (req, res, next) => {
    logger.info('[TICKET ROUTES][PUT /:id] → updateTicketController');
    next();
  },
  updateTicketController
);

// DELETE
router.delete(
  '/:id(\\d+)',
  authenticate,
  (req, res, next) => {
    logger.info('[TICKET ROUTES][DELETE /:id] → deleteTicketController');
    next();
  },
  deleteTicketController
);

// LIST
router.get(
  '/',
  authenticate,
  (req, res, next) => {
    logger.info('[TICKET ROUTES][GET /] → listTicketsController');
    next();
  },
  listTicketsController
);

// VALIDATE (via Payment)
router.post(
  '/validate',
  authenticate,
  validateRequest(validateTicketSchema),
  (req, res, next) => {
    logger.info('[TICKET ROUTES][POST /validate] → validateTicketController (via Payment)');
    next();
  },
  validateTicketController
);

// VERIFY (contrôle sur site)

module.exports = router;
