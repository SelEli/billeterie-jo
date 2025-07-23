const express = require('express');
const router = express.Router();

const {
  createTicketController,
  readTicketController,
  listTicketsController,
  updateTicketController,
  deleteTicketController
} = require('../services/ticketing/controllers/ticket');

const validateRequest = require('../middlewares/validateRequest.middleware');
const { TicketCreateSchema, TicketUpdateSchema } = require('../schemas/ticket.schema');
const authenticate = require('../middlewares/auth.middleware');

router.post(
  '/ticket',
  authenticate,
  validateRequest(TicketCreateSchema),
  createTicketController
);
router.get('/ticket/:id', authenticate, readTicketController);
router.get('/tickets', authenticate, listTicketsController);
router.put(
  '/ticket/:id',
  authenticate,
  validateRequest(TicketUpdateSchema),
  updateTicketController
);
router.delete('/ticket/:id', authenticate, deleteTicketController);

module.exports = router;
