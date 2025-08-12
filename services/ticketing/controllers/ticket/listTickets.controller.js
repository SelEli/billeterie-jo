const logger  = require('../../utils/logger');
const monitor = require('../../monitor/monitor');
const { listTicketsService } = require('../../services/ticket/listTickets.service');

async function listTicketsController(req, res, next) {
  const timer = monitor.timer('ticket_list').start();
  try {
    const tickets = await listTicketsService();

    timer.stop();
    logger.info('Tickets listed successfully');

    res.status(200).json({
      status: 'success',
      data: tickets,
      errors: [],
      meta: { count: tickets.length }
    });
  } catch (error) {
    timer.stop();
    logger.error('Error listing tickets', error);

    res.status(500).json({
      status: 'error',
      data:   null,
      errors: [error.message],
      meta:   { message: 'Failed to list tickets' }
    });
  }
}

module.exports = { listTicketsController };
