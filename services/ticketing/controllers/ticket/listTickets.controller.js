// controllers/tickets/listTickets.controller.js
const logger  = require('../../utils/logger');
const monitor = require('../../monitor/monitor');
const { listTicketsService } = require('../../services/ticket/listTickets.service');

async function listTicketsController(req, res) {
  const timer = monitor.timer('ticket_list').start();
  try {
    logger.debug('[TICKET CONTROLLER] Listing tickets');

    // Si demain on ajoute des filtres, on pourra parser req.query ici
    const tickets = await listTicketsService();

    timer.stop();
    logger.info(`[TICKET CONTROLLER] Tickets listed successfully: count=${tickets.length}`);

    return res.status(200).json({
      status: 'success',
      data: tickets,
      errors: [],
      meta: { count: tickets.length }
    });
  } catch (error) {
    timer.stop();
    logger.error('[TICKET CONTROLLER] Error listing tickets', error);

    return res.status(500).json({
      status: 'error',
      data: null,
      errors: [error.message || 'Internal server error'],
      meta: { message: 'Failed to list tickets' }
    });
  }
}

module.exports = { listTicketsController };
