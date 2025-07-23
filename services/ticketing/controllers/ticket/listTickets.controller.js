const logger = require('../../../utils/logger');
const monitor = require('../../../monitor/monitor');
const { listTickets } = require('../../../services/ticket/listTickets.service');

async function listTicketsController(req, res) {
  try {
    const filter = req.query;
    const { tickets, duration } = await monitor.timer('ticket.list', () => listTickets(filter));
    logger.info(`Listed ${tickets.length} tickets in ${duration}ms`);
    res.status(200).json(tickets);
  } catch (err) {
    logger.error(`listTickets error: ${err.message}`);
    res.status(400).json({ message: err.message });
  }
}

module.exports = { listTicketsController };
