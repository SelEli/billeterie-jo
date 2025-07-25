const logger = require('../../utils/logger');
const monitor = require('../../monitor/monitor');
const { listTickets } = require('../../services/ticket/listTickets.service');

async function listTicketsController(req, res, next) {
  try {
    const filter = req.query;
    const { result: tickets, duration } = await monitor.timer('ticket.list', () => listTickets(filter));
    logger.info(`Listed ${tickets.length} tickets in ${duration}ms`);
    res.status(200).json(tickets);
  } catch (err) {
    logger.error(`listTickets error: ${err.message}`);
    next(err);
  }
}

module.exports = { listTicketsController };
