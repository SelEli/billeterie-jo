const express = require('express');
const router = express.Router();

// 🔐 Middlewares & validation
const authenticate = require('../middlewares/auth.middleware');
const validateRequest = require('../middlewares/validateRequest.middleware');
const { TicketCreateSchema, TicketUpdateSchema } = require('../schemas/ticket.schema');

// 🧠 Handlers (importation correcte des controllers)
const { createTicketController } = require('../controllers/ticket/createTicket.controller');
const { readTicketController } = require('../controllers/ticket/readTicket.controller');
const { updateTicketController } = require('../controllers/ticket/updateTicket.controller');
const { deleteTicketController } = require('../controllers/ticket/deleteTicket.controller');
const { listTicketsController } = require('../controllers/ticket/listTickets.controller');

// 📌 Routes

// Créer un ticket
router.post(
  '/',
  authenticate,
  validateRequest(TicketCreateSchema),
  createTicketController
);

// Lire un ticket par ID
router.get(
  '/:id',
  authenticate,
  readTicketController
);

// Mettre à jour un ticket par ID
router.put(
  '/:id',
  authenticate,
  validateRequest(TicketUpdateSchema),
  updateTicketController
);

// Supprimer un ticket par ID
router.delete(
  '/:id',
  authenticate,
  deleteTicketController
);

// Lister tous les tickets (exemple : GET /)
router.get(
  '/',
  authenticate,
  listTicketsController
);

module.exports = router;
