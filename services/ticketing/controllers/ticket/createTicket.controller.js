// controllers/tickets/createTicket.controller.js

const logger      = require('../../utils/logger');
const monitor     = require('../../monitor/monitor');
const { createTicketService } = require('../../services/ticket/createTicket.service');
const { emitTicketCreated }   = require('../../kafka/ticket.kafka');

async function createTicketController(req, res, next) {
  const missing = [];
  if (req.body.price == null)     missing.push('price');
  if (!req.body.zone)             missing.push('zone');
  if (req.body.eventId == null)   missing.push('eventId');
  if (!req.body.status)           missing.push('status');

  if (missing.length) {
    return res.status(400).json({
      status: 'error',
      data:   null,
      errors: missing.map(f => `Missing field: ${f}`),
      meta:   { message: 'Invalid payload' }
    });
  }

  const timer = monitor.timer('ticket_create').start();
  try {
    const payload = { ...req.body, userId: req.user.userId };
    const ticket  = await createTicketService(payload);

    emitTicketCreated(ticket);
    timer.stop();
    logger.info('Ticket created successfully');

    return res.status(201).json({
      status: 'success',
      data:   ticket,
      errors: [],
      meta:   { message: 'Ticket created successfully' }
    });
  } catch (error) {
    timer.stop();
    logger.error('Error creating ticket', error);

    // Gestion des erreurs de validation du service
    if (error.message.includes('Données invalides')) {
      return res.status(400).json({
        status: 'error',
        data:   null,
        errors: [error.message],
        meta:   { message: 'Invalid payload' }
      });
    }

    // Toute autre erreur remonte en 500
    return res.status(500).json({
      status: 'error',
      data:   null,
      errors: [error.message],
      meta:   { message: 'Failed to create ticket' }
    });
  }
}

module.exports = { createTicketController };
