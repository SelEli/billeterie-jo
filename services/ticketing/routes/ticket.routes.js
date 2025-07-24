const express = require('express');
const router = express.Router();

// ✅ Contrôleurs centralisés depuis controllers/ticket/index.js
const {
  createTicketController,
  readTicketController,
  listTicketsController,
  updateTicketController,
  deleteTicketController
} = require('../controllers/ticket');

// ✅ Middlewares
const validateRequest = require('../middlewares/validateRequest.middleware');
const authenticate = require('../middlewares/auth.middleware');

// ✅ Schémas de validation
const {
  TicketCreateSchema,
  TicketUpdateSchema
} = require('../schemas/ticket.schema');

// 🔀 Routes définies avec authentification & validation
router.post(
  '/ticket',
  authenticate,
  validateRequest(TicketCreateSchema),
  createTicketController
);

router.get(
  '/ticket/:id',
  authenticate,
  readTicketController
);

router.get(
  '/tickets',
  authenticate,
  listTicketsController
);

router.put(
  '/ticket/:id',
  authenticate,
  validateRequest(TicketUpdateSchema),
  updateTicketController
);

router.delete(
  '/ticket/:id',
  authenticate,
  deleteTicketController
);

module.exports = router;
